import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BackIcon, LocationIcon, StarIcon } from "@/components/Icons";
import button from "@/components/Button.module.css";
import Carousel from "@/components/Carousel";
import { getPropertyBySlug } from "@/lib/api";
import styles from "./property.module.css";

export async function generateMetadata({ params }: PageProps<"/logement/[slug]">): Promise<Metadata> {
  const property = await getPropertyBySlug((await params).slug);
  //unknown slug: the 404 page gives its own title
  if (!property) return {};
  return { title: `${property.title} | Kasa`, description: property.description };
}

/**
 * Page of one property (Figma "Page logement"): photos, details and host.
 * The address uses the slug ("/logement/appartement-cosy"), easier to read than the id.
 */
export default async function PropertyPage({ params }: PageProps<"/logement/[slug]">) {
  const property = await getPropertyBySlug((await params).slug);
  if (!property) notFound();
  const { host } = property;

  return (
    <main className={styles.main}>
      <div className={styles.back}>
        <Link href="/" className={styles.backLink}>
          <BackIcon />
          Retour aux annonces
        </Link>
      </div>

      <div className={styles.layout}>
        <div className={styles.gallery}>
          {/* no photo list: the cover photo is shown instead */}
          <Carousel
            pictures={property.pictures.length > 0 ? property.pictures : [property.cover]}
            title={property.title}
          />
        </div>

        <section className={styles.info}>
          <div className={styles.intro}>
            <div className={styles.heading}>
              <h1 className={styles.title}>{property.title}</h1>
              <p className={styles.location}>
                <LocationIcon />
                {property.location}
              </p>
              {/* not in Figma, but the backlog asks for the price on this page */}
              <p className={styles.price}>
                <span className={styles.amount}>{property.price_per_night}€</span> par nuit
              </p>
            </div>
            <p>{property.description}</p>
          </div>
          <div className={styles.group}>
            <h2 className={styles.groupTitle}>Équipements</h2>
            <ul className={styles.equipments}>
              {property.equipments.map((item) => (
                <li key={item} className={styles.tag}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className={`${styles.group} ${styles.categories}`}>
            <h2 className={styles.groupTitle}>Catégorie</h2>
            <ul className={styles.tags}>
              {property.tags.map((tag) => (
                <li key={tag} className={styles.tag}>
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <aside className={styles.host} aria-labelledby="host-title">
          <h2 id="host-title" className={styles.hostTitle}>
            Votre hôte
          </h2>
          <div className={styles.hostRow}>
            {host.picture && (
              <div className={styles.hostPhoto}>
                {/* the name is written next to it: the photo adds nothing for a screen reader */}
                <Image src={host.picture} alt="" width={82} height={82} />
              </div>
            )}
            <p>{host.name}</p>
            <p className={styles.rating}>
              <StarIcon />
              <span className="sr-only">Note :</span>
              {property.rating_avg}
              <span className="sr-only">sur 5</span>
            </p>
          </div>
          <Link href="/messagerie" className={`${button.button} ${styles.hostButton}`}>
            Contacter l’hôte
          </Link>
          <Link href="/messagerie" className={`${button.button} ${styles.hostButton}`}>
            Envoyer un message
          </Link>
        </aside>
      </div>
    </main>
  );
}
