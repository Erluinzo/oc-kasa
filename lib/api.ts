import { cache } from "react";
import { notFound } from "next/navigation";

//runs on the Next server only: the back end sends no CORS headers, so the browser cannot call it
const API_URL = process.env.API_URL ?? "http://localhost:4000";

export type Host = {
  id: number;
  name: string;
  picture: string | null;
};

export type Property = {
  id: string;
  slug: string;
  title: string;
  description: string;
  cover: string;
  location: string;
  price_per_night: number;
  rating_avg: number;
  ratings_count: number;
  host: Host;
};

export type PropertyDetail = Property & {
  pictures: string[];
  equipments: string[];
  tags: string[];
};

/**
 * Calls the Kasa API and returns the JSON answer.
 * No cache: each page load gets fresh data.
 * @param path API path, for example "/api/properties"
 * @throws Error when the API answers with an error status
 */
async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(API_URL + path, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`API error ${res.status} on ${path}`);
  }
  return res.json();
}

export type Conversation = {
  user: Host;
  last_message: { content: string; created_at: string; from_me: boolean };
  unread: number;
};

export type Message = {
  id: number;
  content: string;
  created_at: string;
  from_me: boolean;
  read: boolean;
};

/**
 * Calls an API route that needs the user to be logged in (token sent in the header).
 * With a body it is a POST (the body is sent as JSON), else a GET.
 * @returns the JSON answer, or null when the API refuses the token (missing, wrong or too old)
 * Shows the 404 page when the API answers 404.
 * @throws Error when the API answers with another error
 */
async function authFetch<T>(path: string, token: string, body?: object): Promise<T | null> {
  const res = await fetch(API_URL + path, {
    method: body ? "POST" : "GET",
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: body && JSON.stringify(body),
  });
  if (res.status === 401) return null;
  //the asked thing does not exist (for example an unknown user): 404 page
  if (res.status === 404) notFound();
  if (!res.ok) {
    throw new Error(`API error ${res.status} on ${path}`);
  }
  return res.json();
}

/**
 * Gets the list of all properties.
 */
export function getProperties() {
  return apiFetch<Property[]>("/api/properties");
}

/**
 * Gets one property with its pictures, equipments and tags.
 * @param id property id, for example "c67ab8a7"
 */
export function getProperty(id: string) {
  return apiFetch<PropertyDetail>(`/api/properties/${encodeURIComponent(id)}`);
}

/**
 * Finds a property by its slug ("appartement-cosy"): the API gives details by id only,
 * so the id is taken from the list. Returns null when no property has this slug.
 * cache(): the page and its metadata ask for the same property, the API is called once.
 */
export const getPropertyBySlug = cache(async (slug: string) => {
  const property = (await getProperties()).find((item) => item.slug === slug);
  return property ? getProperty(property.id) : null;
});

/**
 * Logs in with an email and a password.
 * @returns the login token (JWT), or null when the email or the password is wrong
 * @throws Error when the API answers with another error
 */
export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });
  //400: a field is empty, 401: wrong email or password
  if (res.status === 400 || res.status === 401) return null;
  if (!res.ok) {
    throw new Error(`API error ${res.status} on /auth/login`);
  }
  const data: { token: string } = await res.json();
  return data.token;
}

/**
 * Creates an account (role "client") and returns its login token.
 * @returns the token, or null when an account already uses this email
 * @throws Error when the API answers with another error
 */
export async function register(name: string, email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
    cache: "no-store",
  });
  if (res.status === 409) return null;
  if (!res.ok) {
    throw new Error(`API error ${res.status} on /auth/register`);
  }
  const data: { token: string } = await res.json();
  return data.token;
}

/**
 * Gets the conversations of the logged-in user, newest first.
 * @returns the list, or null when the token is refused
 */
export function getConversations(token: string) {
  return authFetch<Conversation[]>("/api/messages", token);
}

/**
 * Gets the other user and all messages with them, oldest first.
 * The API marks the received messages as read.
 * @param userId id of the other user
 * @returns the conversation, or null when the token is refused
 */
export function getConversation(token: string, userId: number) {
  return authFetch<{ user: Host; messages: Message[] }>(`/api/messages/${userId}`, token);
}

/**
 * Sends a message to another user.
 * @param userId id of the other user
 * @returns the message saved by the API, or null when the token is refused
 */
export function sendMessage(token: string, userId: number, content: string) {
  return authFetch<Message>(`/api/messages/${userId}`, token, { content });
}
