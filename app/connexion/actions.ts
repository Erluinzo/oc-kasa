"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { login } from "@/lib/api";

export type LoginState = { error: string; email: string } | null;

/**
 * Login form action, run on the Next server. Checks the email and password with the API,
 * then keeps the token in an httpOnly cookie: the JavaScript of the page can't read it.
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
  (await cookies()).set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    //7 days, like the token
    maxAge: 7 * 24 * 60 * 60,
    //only sent to Kasa, not to the other sites of the same domain (nx-lab.com/kasa)
    path: process.env.BASE_PATH || "/",
  });
  redirect("/");
}
