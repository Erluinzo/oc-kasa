"use server";

import { redirect } from "next/navigation";
import { login } from "@/lib/api";
import { saveToken } from "@/lib/session";

export type LoginState = { error: string; email: string } | null;

/**
 * Login form action, run on the Next server. Checks the email and password with the API,
 * then keeps the token in an httpOnly cookie (see saveToken).
 * Returns an error message (and the email, to show it again) when the login fails.
 */
export async function logIn(_state: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  let token: string | null;
  try {
    token = await login(email, password);
  } catch (err) {
    console.log(err);
    return { error: "La connexion est impossible pour le moment. Réessayez dans un instant.", email };
  }
  if (!token) {
    return { error: "Adresse email ou mot de passe incorrect.", email };
  }
  await saveToken(token);
  redirect("/");
}
