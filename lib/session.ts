import { cookies } from "next/headers";

/**
 * Keeps the login token in a cookie, after login or sign up (server only).
 * httpOnly: the JavaScript of the page can't read it. 7 days, like the token.
 */
export async function saveToken(token: string) {
  (await cookies()).set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    //only sent to Kasa, not to the other sites of the same domain (nx-lab.com/kasa)
    path: process.env.BASE_PATH || "/",
  });
}
