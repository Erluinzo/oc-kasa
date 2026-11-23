import type { Metadata } from "next";
import Link from "next/link";
import button from "@/components/Button.module.css";
import styles from "./status.module.css";

export const metadata: Metadata = {
  title: "Page introuvable | Kasa",
};

export default function NotFound() {
  return (
    <main className={styles.main}>
      <div className={styles.intro}>
        <h1 className={styles.code}>404</h1>
        <p>Il semble que la page que vous cherchez ait pris des vacances… ou n’ait jamais existé.</p>
      </div>
      <div className={styles.actions}>
        <Link href="/" className={button.button}>
          Accueil
        </Link>
        <Link href="/#logements" className={button.button}>
          Logements
        </Link>
      </div>
    </main>
  );
}
