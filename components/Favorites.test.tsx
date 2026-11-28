import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import FavoriteButton from "./FavoriteButton";
import { FavoritesProvider, useFavorites } from "./Favorites";

function renderCards() {
  return render(
    <FavoritesProvider>
      <FavoriteButton id="c67ab8a7" title="Appartement cosy" />
      <FavoriteButton id="b9123946" title="Studio de charme" />
    </FavoritesProvider>,
  );
}

//shows the saved ids, like the favorites page will
function Count() {
  const { favorites } = useFavorites();
  return <p>{favorites.length} favoris</p>;
}

afterEach(() => localStorage.clear());

describe("Favorites", () => {
  it("starts with no favorite", () => {
    renderCards();
    expect(screen.getByRole("button", { name: "Ajouter Appartement cosy aux favoris" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ajouter Studio de charme aux favoris" })).toBeInTheDocument();
  });

  it("adds a property to the favorites and saves it", async () => {
    renderCards();
    await userEvent.click(screen.getByRole("button", { name: "Ajouter Appartement cosy aux favoris" }));
    expect(screen.getByRole("button", { name: "Retirer Appartement cosy des favoris" })).toBeInTheDocument();
    expect(localStorage.getItem("kasa-favorites")).toBe('["c67ab8a7"]');
  });

  it("removes a favorite with a second click", async () => {
    renderCards();
    const heart = screen.getByRole("button", { name: "Ajouter Appartement cosy aux favoris" });
    await userEvent.click(heart);
    await userEvent.click(heart);
    expect(heart).toHaveAccessibleName("Ajouter Appartement cosy aux favoris");
    expect(localStorage.getItem("kasa-favorites")).toBe("[]");
  });

  it("keeps the other favorites", async () => {
    renderCards();
    await userEvent.click(screen.getByRole("button", { name: "Ajouter Appartement cosy aux favoris" }));
    await userEvent.click(screen.getByRole("button", { name: "Ajouter Studio de charme aux favoris" }));
    await userEvent.click(screen.getByRole("button", { name: "Retirer Appartement cosy des favoris" }));
    expect(localStorage.getItem("kasa-favorites")).toBe('["b9123946"]');
    expect(screen.getByRole("button", { name: "Retirer Studio de charme des favoris" })).toBeInTheDocument();
  });

  it("reads the favorites saved by an earlier visit", () => {
    localStorage.setItem("kasa-favorites", '["b9123946"]');
    renderCards();
    expect(screen.getByRole("button", { name: "Ajouter Appartement cosy aux favoris" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Retirer Studio de charme des favoris" })).toBeInTheDocument();
  });

  it("shares the favorites with the other components", async () => {
    render(
      <FavoritesProvider>
        <FavoriteButton id="c67ab8a7" title="Appartement cosy" />
        <Count />
      </FavoritesProvider>,
    );
    expect(screen.getByText("0 favoris")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Ajouter Appartement cosy aux favoris" }));
    expect(screen.getByText("1 favoris")).toBeInTheDocument();
  });

  it("starts again with no favorite when the saved text is broken", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    localStorage.setItem("kasa-favorites", "{broken");
    renderCards();
    expect(screen.getAllByRole("button", { name: /^Ajouter/ })).toHaveLength(2);
    log.mockRestore();
  });

  it("needs the provider", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Count />)).toThrow("useFavorites must be used inside FavoritesProvider");
    error.mockRestore();
  });
});
