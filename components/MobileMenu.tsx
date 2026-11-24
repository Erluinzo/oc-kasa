"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { CloseIcon, MenuIcon } from "@/components/Icons";
import button from "./Button.module.css";
import picto from "@/public/logo-picto.svg";
import styles from "./MobileMenu.module.css";

const LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/a-propos", label: "À propos" },
  { href: "/messagerie", label: "Messagerie" },
  { href: "/favoris", label: "Favoris" },
];

/**
 * Menu button and full-screen menu for small screens (Figma "Menu / mobile open").
 * Client component: it opens and closes the menu.
 * A native modal <dialog> keeps the focus inside, closes with Escape
 * and gives the focus back to the menu button.
 */
export default function MobileMenu() {
  const dialog = useRef<HTMLDialogElement>(null);

  //a link click changes the page without reloading it, so the menu must be closed by hand
  function closeOnLink(event: React.MouseEvent) {
    if ((event.target as HTMLElement).closest("a")) dialog.current?.close();
  }

  return (
    <>
      <button
        type="button"
        className={styles.toggle}
        aria-label="Ouvrir le menu"
        aria-haspopup="dialog"
        onClick={() => dialog.current?.showModal()}
      >
        <MenuIcon />
      </button>
      <dialog ref={dialog} className={styles.menu} aria-label="Menu" onClick={closeOnLink}>
        <div className={styles.top}>
          <Link href="/">
            <Image src={picto} alt="Kasa, accueil" width={46} height={53} />
          </Link>
          <button
            type="button"
            className={styles.close}
            aria-label="Fermer le menu"
            autoFocus
            onClick={() => dialog.current?.close()}
          >
            <CloseIcon />
          </button>
        </div>
        <nav className={styles.nav} aria-label="Navigation principale">
          <ul className={styles.links}>
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={styles.link}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Link href="/ajouter-logement" className={`${button.button} ${styles.add}`}>
          Ajouter un logement
        </Link>
      </dialog>
    </>
  );
}
