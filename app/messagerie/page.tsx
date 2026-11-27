import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BackIcon } from "@/components/Icons";
import button from "@/components/Button.module.css";
import { getConversation, getConversations } from "@/lib/api";
import { getToken, readToken } from "@/lib/session";
import Avatar from "./Avatar";
import MessageForm from "./MessageForm";
import { formatDay, formatListDate, formatTime } from "./dates";
import styles from "./messages.module.css";

export const metadata: Metadata = {
  title: "Messagerie | Kasa",
  //private page: search engines must not list it
  robots: { index: false },
};

/**
 * Messaging page (Figma "Messagerie"): the conversations on the left, the open one on the right.
 * "?avec=12" opens the conversation with the user 12. Logged-in users only.
 * On mobile only one side is shown: the list, or the open conversation.
 */
export default async function MessagesPage({ searchParams }: PageProps<"/messagerie">) {
  const { avec } = await searchParams;
  //only a whole number is a user id
  const otherId = typeof avec === "string" && /^\d+$/.test(avec) ? Number(avec) : null;
  const here = otherId ? `/messagerie?avec=${otherId}` : "/messagerie";
  const login = `/connexion?next=${encodeURIComponent(here)}`;

  const token = await getToken();
  if (!token) redirect(login);
  const conversations = await getConversations(token);
  //null: the API refused the token (too old): log in again
  if (!conversations) redirect(login);
  const me = readToken(token);
  //no conversation with myself
  if (otherId === me.id) redirect("/messagerie");
  const conversation = otherId ? await getConversation(token, otherId) : null;
  if (otherId && !conversation) redirect(login);

  return (
    <main className={styles.main}>
      {/* page title for screen readers: on mobile the list (and its title) is hidden when a conversation is open */}
      <h1 className="sr-only">Messagerie</h1>
      <div className={`${styles.box} ${conversation ? styles.open : ""}`}>
        <section className={styles.list} aria-labelledby="messages-title">
          <div className={styles.backBar}>
            <Link href="/" className={button.back}>
              <BackIcon />
              Retour
            </Link>
          </div>
          <h2 id="messages-title" className={styles.title}>
            Messages
          </h2>
          {conversations.length === 0 ? (
            <p className={styles.empty}>
              Aucune conversation pour le moment. Écrivez à un hôte depuis la page d’un logement.
            </p>
          ) : (
            <ul className={styles.conversations}>
              {conversations.map(({ user, last_message, unread }) => (
                <li key={user.id}>
                  {/* no prefetch: opening a conversation marks its messages as read */}
                  <Link
                    href={`/messagerie?avec=${user.id}`}
                    prefetch={false}
                    className={styles.conversation}
                    aria-current={user.id === otherId ? "page" : undefined}
                  >
                    <Avatar name={user.name} picture={user.picture} size="large" />
                    <span className={styles.summary}>
                      <span className={styles.name}>{user.name}</span>
                      <span className={styles.preview}>
                        {last_message.from_me && "Vous : "}
                        {last_message.content}
                      </span>
                    </span>
                    <span className={styles.meta}>
                      <time dateTime={last_message.created_at}>{formatListDate(last_message.created_at)}</time>
                      {/* the open conversation is read now (the API marked it, the list was loaded before) */}
                      {unread > 0 && user.id !== otherId && (
                        <span className={styles.dot}>
                          <span className="sr-only">
                            {unread === 1 ? "1 message non lu" : `${unread} messages non lus`}
                          </span>
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={styles.thread} aria-labelledby="thread-title">
          {conversation ? (
            <>
              {/* mobile only: back to the list */}
              <div className={styles.threadBack}>
                <Link href="/messagerie" className={button.back}>
                  <BackIcon />
                  Retour
                </Link>
              </div>
              <h2 id="thread-title" className="sr-only">
                Conversation avec {conversation.user.name}
              </h2>
              {/* column-reverse: the scroll starts at the bottom, on the newest messages.
                  role log (a chat history) + tabIndex: the keyboard can scroll it */}
              <div className={styles.scroller} role="log" aria-labelledby="thread-title" tabIndex={0}>
                {conversation.messages.length === 0 ? (
                  <p className={styles.empty}>Aucun message avec {conversation.user.name} pour le moment.</p>
                ) : (
                  <ol className={styles.messages}>
                    {conversation.messages.map((message, index) => {
                      const day = formatDay(message.created_at);
                      const previous = conversation.messages[index - 1];
                      const name = message.from_me ? me.name : conversation.user.name;
                      return (
                        <li key={message.id}>
                          {/* a line with the date when the day changes */}
                          {(!previous || formatDay(previous.created_at) !== day) && (
                            <p className={styles.day}>{day}</p>
                          )}
                          <div className={`${styles.message} ${message.from_me ? styles.mine : ""}`}>
                            <Avatar
                              name={name}
                              picture={message.from_me ? null : conversation.user.picture}
                              size="small"
                            />
                            <div className={styles.body}>
                              <p className={styles.author}>
                                {message.from_me ? "Vous" : name}
                                <span className={styles.separator} aria-hidden="true" />
                                <time dateTime={message.created_at}>{formatTime(message.created_at)}</time>
                              </p>
                              <p className={styles.bubble}>{message.content}</p>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                )}
              </div>
              <MessageForm to={conversation.user.id} />
            </>
          ) : (
            <>
              <h2 id="thread-title" className="sr-only">
                Conversation
              </h2>
              <p className={styles.choose}>Choisissez une conversation pour lire les messages.</p>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
