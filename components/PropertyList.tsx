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
