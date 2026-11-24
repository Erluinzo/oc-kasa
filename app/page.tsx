import { Suspense } from "react";
import Image from "next/image";
import PropertyList, { PropertyListSkeleton } from "@/components/PropertyList";
import { getProperties } from "@/lib/api";
import hero from "@/public/hero.jpg";
import styles from "./home.module.css";

/**
 * Loads the properties from the API. It is a separate component so the page
 * can show everything else at once and a skeleton here while the API answers.
 */
async function Properties() {
  const properties = await getProperties();
  return <PropertyList properties={properties} />;
}

export default function Home() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <h1 className={styles.title}>
          Chez vous, <br className={styles.break} />
          partout et ailleurs
        </h1>
        <p>
          Avec Kasa, vivez des séjours uniques dans des hébergements chaleureux, sélectionnés avec
          soin par nos hôtes.
        </p>
        <div className={styles.photo}>
          {/* decorative photo: empty alt. preload: it is the largest image of the page (LCP) */}
          <Image src={hero} alt="" width={1117} height={894} sizes="1117px" preload />
        </div>
      </section>

      {/* id: the 404 page "Logements" button comes here */}
      <div id="logements">
        <Suspense fallback={<PropertyListSkeleton />}>
          <Properties />
        </Suspense>
      </div>

      <section className={styles.how} aria-labelledby="how-title">
        <div className={styles.howIntro}>
          <h2 id="how-title" className={styles.howTitle}>
            Comment ça marche ?
          </h2>
          <p>
            Que vous partiez pour un week-end improvisé, des vacances en famille ou un voyage
            professionnel,
            <br />
            Kasa vous aide à trouver un lieu qui vous ressemble.
          </p>
        </div>
        <ol className={styles.steps}>
          <li className={styles.step}>
            <h3 className={styles.stepTitle}>Recherchez</h3>
            <p className={styles.stepText}>
              Entrez votre destination, vos dates et laissez Kasa faire le reste
            </p>
          </li>
          <li className={styles.step}>
            <h3 className={styles.stepTitle}>Réservez</h3>
            <p className={styles.stepText}>
              Profitez d’une plateforme sécurisée
              <br />
              et de profils d’hôtes vérifiés.
            </p>
          </li>
          <li className={styles.step}>
            <h3 className={styles.stepTitle}>Vivez l’expérience</h3>
            <p className={styles.stepText}>
              Installez-vous, profitez de votre séjour,
              <br />
              et sentez-vous chez vous, partout.
            </p>
          </li>
        </ol>
      </section>
    </main>
  );
}
