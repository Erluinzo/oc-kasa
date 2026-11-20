import Image from "next/image";
import Link from "next/link";
import { HeartIcon, MessageIcon } from "@/components/Icons";
import styles from "./Header.module.css";

/**
 * Site header: links, logo and favorites / messages icons (Figma "Menu").
 * Server component: it has no state, so it sends no JavaScript to the browser.
 */
export default function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Navigation principale">
        <ul className={styles.group}>
          <li>
            {/* data-text is the bold copy shown on hover (see Header.module.css) */}
            <Link href="/" className={styles.link} data-text="Accueil">
              Accueil
            </Link>
          </li>
          <li>
            <Link href="/a-propos" className={styles.link} data-text="À propos">
              À propos
            </Link>
          </li>
        </ul>
        <Link href="/" className={styles.logo}>
          <Image src="/logo.svg" alt="Kasa, accueil" width={113} height={40} priority />
        </Link>
        <ul className={styles.group}>
          <li>
            <Link
              href="/ajouter-logement"
              className={`${styles.link} ${styles.add}`}
              data-text="+Ajouter un logement"
            >
              +Ajouter un logement
            </Link>
          </li>
          <li className={styles.icons}>
            <Link href="/favoris" className={styles.icon} aria-label="Favoris">
              <HeartIcon />
            </Link>
            <span className={styles.separator} aria-hidden="true" />
            <Link href="/messagerie" className={styles.icon} aria-label="Messagerie">
              <MessageIcon />
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
