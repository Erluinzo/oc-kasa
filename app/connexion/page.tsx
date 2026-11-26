import type { Metadata } from "next";
import LoginForm from "./LoginForm";
import styles from "../account.module.css";

export const metadata: Metadata = {
  title: "Connexion | Kasa",
  description: "Connectez-vous à Kasa pour retrouver vos réservations, vos annonces et vos messages.",
};

/**
 * Login page (Figma "Log In"): a white card with the title and the form.
 */
export default function LoginPage() {
  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={styles.intro}>
          <h1 className={styles.title}>Heureux de vous revoir</h1>
          <p className={styles.text}>
            Connectez-vous pour retrouver vos réservations, vos annonces et tout ce qui rend vos
            séjours uniques.
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
