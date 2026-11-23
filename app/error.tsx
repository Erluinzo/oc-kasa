"use client";

import Link from "next/link";
import button from "@/components/Button.module.css";
import styles from "./status.module.css";

/**
 * Shown when a page fails, for example when the API does not answer.
 * Same look as the 404 page. "Réessayer" loads the page again from the server.
 */
export default function Error({ retry }: { retry: () => void }) {
  return (
    <main className={styles.main}>
      <div className={styles.intro}>
        <h1 className={styles.code}>Oups</h1>
        <p>Les informations n’ont pas pu être chargées. Réessayez dans un instant.</p>
      </div>
      <div className={styles.actions}>
        <button type="button" className={button.button} onClick={() => retry()}>
          Réessayer
        </button>
        <Link href="/" className={button.button}>
          Accueil
        </Link>
      </div>
    </main>
  );
}
