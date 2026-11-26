"use server";

import { redirect } from "next/navigation";
import { register } from "@/lib/api";
import { saveToken } from "@/lib/session";

export type SignUpState = {
  error: string;
  emailTaken: boolean;
  lastName: string;
  firstName: string;
  email: string;
} | null;

/**
 * Sign-up form action, run on the Next server. Checks the fields again (the browser
 * checks can be skipped), creates the account with the API, then logs the user in.
 * Returns an error message and the typed values (to show them again) when it fails.
 */
export async function signUp(_state: SignUpState, formData: FormData): Promise<SignUpState> {
  const lastName = String(formData.get("lastName") ?? "").trim();
  const firstName = String(formData.get("firstName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const values = { lastName, firstName, email, emailTaken: false };

  //same rules as the form fields (required, max 50 letters, email with "@", password 6+)
  const nameOk = lastName && firstName && lastName.length <= 50 && firstName.length <= 50;
  if (!nameOk || !email.includes("@") || password.length < 6 || !formData.get("terms")) {
    return { ...values, error: "Vérifiez les champs : tous sont obligatoires, et le mot de passe doit avoir au moins 6 caractères." };
  }

  let token: string | null;
  try {
    token = await register(`${firstName} ${lastName}`, email, password);
  } catch (err) {
    console.log(err);
    return { ...values, error: "L’inscription est impossible pour le moment. Réessayez dans un instant." };
  }
  if (!token) {
    return { ...values, emailTaken: true, error: "Un compte existe déjà avec cette adresse email." };
  }
  await saveToken(token);
  redirect("/");
}
