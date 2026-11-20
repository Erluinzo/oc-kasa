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
