//dates are shown in French time, whatever the time zone of the server
const zone = "Europe/Paris";

const time = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: zone });
const shortDay = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", timeZone: zone });
const longDay = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "long", year: "numeric", timeZone: zone });

/**
 * Time of a message ("11:04").
 */
export function formatTime(iso: string) {
  return time.format(new Date(iso));
}

/**
 * Date in the conversation list: the time for today ("11:04"), else the day ("3 sept.").
 */
export function formatListDate(iso: string, now = new Date()) {
  const date = new Date(iso);
  return longDay.format(date) === longDay.format(now) ? time.format(date) : shortDay.format(date);
}

/**
 * Day written between the messages of different days ("03 septembre 2025").
 */
export function formatDay(iso: string) {
  return longDay.format(new Date(iso));
}
