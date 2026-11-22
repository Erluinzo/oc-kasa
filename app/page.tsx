import Image from "next/image";
import PropertyList from "@/components/PropertyList";
import { getProperties } from "@/lib/api";
import styles from "./home.module.css";

export default async function Home() {
  const properties = await getProperties();

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
          <Image src="/hero.jpg" alt="" width={1117} height={894} sizes="1117px" preload />
        </div>
      </section>
      <PropertyList properties={properties} />
    </main>
  );
}
