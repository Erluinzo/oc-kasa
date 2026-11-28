"use client";

import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";

const KEY = "kasa-favorites";
const listeners = new Set<() => void>();

type FavoritesValue = {
  favorites: string[];
  toggleFavorite: (id: string) => void;
};

const FavoritesContext = createContext<FavoritesValue | null>(null);

//React calls it to know when the saved list changes (in this tab, or in another tab with "storage")
function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

//the saved text ('["c67ab8a7","b9123946"]'): a string, so React sees no change while it stays the same
function getSnapshot() {
  try {
    return localStorage.getItem(KEY) ?? "[]";
  } catch (err) {
    //storage can be blocked (private window, browser settings)
    console.log(err);
    return "[]";
  }
}

//the server has no localStorage: the page is first drawn with no favorite
function getServerSnapshot() {
  return "[]";
}

function parse(saved: string): string[] {
  try {
    const list = JSON.parse(saved);
    return Array.isArray(list) ? list.filter((id) => typeof id === "string") : [];
  } catch (err) {
    //broken text in the storage: start again with no favorite
    console.log(err);
    return [];
  }
}

/**
 * Keeps the ids of the favorite properties in localStorage and shares them
 * with every component of the site (React Context).
 */
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const favorites = parse(useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot));

  function toggleFavorite(id: string) {
    const next = favorites.includes(id) ? favorites.filter((f) => f !== id) : [...favorites, id];
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch (err) {
      console.log(err);
    }
    listeners.forEach((listener) => listener());
  }

  return <FavoritesContext value={{ favorites, toggleFavorite }}>{children}</FavoritesContext>;
}

/**
 * Gives the favorite ids and the function to add or remove one.
 * Only works inside FavoritesProvider.
 */
export function useFavorites() {
  const value = useContext(FavoritesContext);
  if (!value) throw new Error("useFavorites must be used inside FavoritesProvider");
  return value;
}
