"use client";

import { useFavorites } from "./Favorites";
import { HeartFullIcon } from "./Icons";
import styles from "./PropertyCard.module.css";

/**
 * Heart on a property card: adds the property to the favorites, or removes it.
 * Figma: grey button with a grey heart, red button with a white heart when it is a favorite.
 */
export default function FavoriteButton({ id, title }: { id: string; title: string }) {
  const { favorites, toggleFavorite } = useFavorites();
  const favorite = favorites.includes(id);

  return (
    <button
      type="button"
      className={`${styles.heart} ${favorite ? styles.favorite : ""}`}
      aria-label={favorite ? `Retirer ${title} des favoris` : `Ajouter ${title} aux favoris`}
      onClick={() => toggleFavorite(id)}
    >
      <HeartFullIcon />
    </button>
  );
}
