"use client";

import { useActionState, type KeyboardEvent } from "react";
import { BackIcon } from "@/components/Icons";
import { send } from "./actions";
import styles from "./messages.module.css";

/**
 * Box to write a message, under the conversation with the user "to".
 * Enter sends the message, Shift + Enter goes to a new line.
 */
export default function MessageForm({ to }: { to: number }) {
  const [state, formAction, pending] = useActionState(send, null);

  function handleKey(event: KeyboardEvent<HTMLTextAreaElement>) {
    //isComposing: Enter also confirms a word typed with an input method (Chinese, Japanese…)
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <form action={formAction} className={styles.composer}>
      <input type="hidden" name="to" value={to} />
      <div className={styles.inputBox}>
        <label htmlFor="message" className="sr-only">
          Votre message
        </label>
        <textarea
          id="message"
          name="content"
          placeholder="Envoyer un message"
          required
          maxLength={2000}
          //React empties the form after sending it: on error the text comes back from the action
          defaultValue={state?.content}
          onKeyDown={handleKey}
          aria-describedby={state ? "message-error" : undefined}
          className={styles.field}
        />
        {/* Figma "send" icon = the back arrow turned up (CSS) */}
        <button type="submit" className={styles.send} disabled={pending} aria-label="Envoyer le message">
          <BackIcon />
        </button>
      </div>
      {state && (
        <p id="message-error" role="alert" className={styles.sendError}>
          {state.error}
        </p>
      )}
    </form>
  );
}
