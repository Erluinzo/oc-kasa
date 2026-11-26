import type { Metadata } from "next";
import SignUpForm from "./SignUpForm";
import styles from "../account.module.css";

export const metadata: Metadata = {
  title: "Inscription | Kasa",
  description: "Créez votre compte Kasa pour réserver des logements uniques et échanger avec les hôtes.",
};

/**
 * Sign-up page (Figma "Sign In"): same white card as the login page.
 */
export default function SignUpPage() {
  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={styles.intro}>
          <h1 className={styles.title}>
            Rejoignez la <br className={styles.break} />
            communauté Kasa
          </h1>
          <p className={`${styles.text} ${styles.wide}`}>
            Créez votre compte et commencez à voyager autrement : réservez des logements uniques,
            découvrez de nouvelles destinations et partagez vos propres lieux avec d’autres voyageurs.
          </p>
        </div>
        <SignUpForm />
      </div>
    </main>
  );
}
