import PropertyCard from "@/components/PropertyCard";
import type { Property } from "@/lib/api";
import styles from "./PropertyList.module.css";

/**
 * Grid of property cards: 3 columns on a large screen, 1 on a phone.
 */
export default function PropertyList({ properties }: { properties: Property[] }) {
  return (
    <ul className={styles.list}>
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </ul>
  );
}

/**
 * Grey cards shown while the properties load. Same size as the real cards,
 * so nothing moves when they arrive.
 */
export function PropertyListSkeleton() {
  return (
    <div>
      <p className="sr-only" role="status">
        Chargement des logements…
      </p>
      <ul className={styles.list} aria-hidden="true">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <li key={n} className={styles.skeleton} />
        ))}
      </ul>
    </div>
  );
}
