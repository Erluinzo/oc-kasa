import Image from "next/image";
import Link from "next/link";
import FavoriteButton from "@/components/FavoriteButton";
import type { Property } from "@/lib/api";
import styles from "./PropertyCard.module.css";

/**
 * One property on a list (Figma "Card propriété"): photo, heart, title, place and price.
 * The title link covers the whole card, so the heart can stay a separate button
 * (a button inside a link is not valid HTML).
 */
export default function PropertyCard({ property }: { property: Property }) {
  return (
    <li className={styles.card}>
      <div className={styles.photo}>
        <Image src={property.cover} alt={property.title} fill sizes="355px" />
      </div>
      <FavoriteButton id={property.id} title={property.title} />
      <div className={styles.details}>
        <div className={styles.text}>
          <h2 className={styles.title}>
            <Link href={`/logement/${property.slug}`} className={styles.link}>
              {property.title}
            </Link>
          </h2>
          <p className={styles.location}>{property.location}</p>
        </div>
        <p className={styles.price}>
          <span className={styles.amount}>{property.price_per_night}€</span> par nuit
        </p>
      </div>
    </li>
  );
}
