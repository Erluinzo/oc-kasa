"use client";

import { useActionState } from "react";
import Link from "next/link";
import button from "@/components/Button.module.css";
import { signUp } from "./actions";
import styles from "../account.module.css";

/**
 * Sign-up form (last name, first name, email, password, terms). The browser checks the
 * fields first, the server checks them again (signUp action); errors are read aloud (role="alert").
 */
export default function SignUpForm() {
  const [state, formAction, pending] = useActionState(signUp, null);
  const describedBy = state ? "signup-error" : undefined;

  return (
    <form action={formAction} className={styles.form}>
      <div className={styles.fields}>
        <div className={styles.field}>
          <label htmlFor="lastName" className={styles.label}>
            Nom
          </label>
          <input
            id="lastName"
            name="lastName"
            autoComplete="family-name"
            required
            maxLength={50}
            //React empties the form after sending it: the values typed come back from the action
            defaultValue={state?.lastName}
            aria-describedby={describedBy}
            className={styles.input}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="firstName" className={styles.label}>
            Prénom
          </label>
          <input
            id="firstName"
            name="firstName"
            autoComplete="given-name"
            required
            maxLength={50}
            defaultValue={state?.firstName}
            aria-describedby={describedBy}
            className={styles.input}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>
            Adresse email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue={state?.email}
            aria-invalid={state?.emailTaken || undefined}
            aria-describedby={describedBy}
            className={styles.input}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="password" className={styles.label}>
            Mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            aria-describedby={state ? "password-hint signup-error" : "password-hint"}
            className={styles.input}
          />
          <p id="password-hint" className={styles.hint}>
            Au moins 6 caractères
          </p>
        </div>
        <label className={styles.terms}>
          {/* the form could only be sent with the box checked: keep it checked after an error */}
          <input type="checkbox" name="terms" required defaultChecked={state !== null} />
          J’accepte les conditions générales d’utilisation
        </label>
        {state && (
          <p id="signup-error" role="alert" className={styles.error}>
            {state.error}
          </p>
        )}
      </div>
      <div className={styles.actions}>
        <button type="submit" className={`${button.button} ${styles.submit}`} disabled={pending}>
          {pending ? "Inscription…" : "S’inscrire"}
        </button>
        <Link href="/connexion" className={styles.switch}>
          Déjà membre ? Se connecter
        </Link>
      </div>
    </form>
  );
}
