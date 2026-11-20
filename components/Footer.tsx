import Image from "next/image";
import styles from "./Footer.module.css";

/**
 * Site footer: small logo and copyright (Figma "Footer").
 */
export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Image src="/logo-picto.svg" alt="Kasa" width={46} height={53} />
      <p className={styles.copyright}>© 2025 Kasa. All rights reserved</p>
    </footer>
  );
}
