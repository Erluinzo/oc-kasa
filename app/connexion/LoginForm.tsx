"use client";

import { useActionState } from "react";
import Link from "next/link";
import button from "@/components/Button.module.css";
import { logIn } from "./actions";
import styles from "../account.module.css";

/**
 * Email + password form. The check is done on the server (logIn action);
 * the error is read aloud by screen readers (role="alert") and linked to the fields.
 */
export default function LoginForm() {
  const [state, formAction, pending] = useActionState(logIn, null);
  const invalid = state ? true : undefined;
  const describedBy = state ? "login-error" : undefined;

  return (
    <form action={formAction} className={styles.form}>
      <div className={styles.fields}>
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
            //React empties the form after sending it: the email typed comes back from the action
            defaultValue={state?.email}
            aria-invalid={invalid}
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
            autoComplete="current-password"
            required
            aria-invalid={invalid}
            aria-describedby={describedBy}
            className={styles.input}
          />
        </div>
        {state && (
          <p id="login-error" role="alert" className={styles.error}>
            {state.error}
          </p>
        )}
      </div>
      <div className={styles.actions}>
        <button type="submit" className={`${button.button} ${styles.submit}`} disabled={pending}>
          {pending ? "Connexion…" : "Se connecter"}
        </button>
        <Link href="/inscription" className={styles.switch}>
          Pas encore de compte ? Inscrivez-vous
        </Link>
      </div>
    </form>
  );
}
