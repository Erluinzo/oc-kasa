"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sendMessage } from "@/lib/api";
import { getToken } from "@/lib/session";

export type SendState = { error: string; content: string } | null;

/**
 * Message form action, run on the Next server: sends the message with the user's token,
 * then loads the conversation again so the new message shows.
 * Returns an error message (and the text, to show it again) when it fails.
 */
export async function send(_state: SendState, formData: FormData): Promise<SendState> {
  const to = Number(formData.get("to"));
  //a sent form writes line breaks as "\r\n": keep "\n" (and the length the field counted)
  const content = String(formData.get("content") ?? "").replace(/\r\n/g, "\n").trim();
  //same rules as the API: 1 to 2000 characters
  if (!Number.isInteger(to) || to < 1 || !content || content.length > 2000) {
    return { error: "Écrivez un message de 1 à 2000 caractères.", content };
  }
  const login = `/connexion?next=${encodeURIComponent(`/messagerie?avec=${to}`)}`;
  const token = await getToken();
  if (!token) redirect(login);

  let sent;
  try {
    sent = await sendMessage(token, to, content);
  } catch (err) {
    console.log(err);
    return { error: "Le message n’a pas pu être envoyé. Réessayez dans un instant.", content };
  }
  //null: the token is too old, log in again
  if (!sent) redirect(login);
  revalidatePath("/messagerie");
  return null;
}
