import characterImageJson from "@/characterImage.json";

export const PLAYERS = [
  "Sumit",
  "Gourav",
  "Jay",
  "Shubham",
  "Sarvadhnaya",
] as const;

export type PlayerName = (typeof PLAYERS)[number];

/** Trophy delta applied on every match. Change in one place. */
export const TROPHY_CONFIG = {
  startingTrophies: 1000,
  winDelta: 25,
  lossDelta: -25,
} as const;

function displayNameFromId(id: string): string {
  return id
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/** Roster + image URLs come from characterImage.json only. */
export const CHARACTERS = characterImageJson.map((entry) => ({
  id: entry.name,
  name: displayNameFromId(entry.name),
  url: entry.url,
}));

export type CharacterId = (typeof CHARACTERS)[number]["id"];

/** Single fallback when a remote character image fails. */
export const CHARACTER_FALLBACK_IMAGE = "/characters/fallback.svg";

const remoteById = new Map(CHARACTERS.map((c) => [c.id, c.url]));

export function characterRemoteImageUrl(characterId: string): string | undefined {
  return remoteById.get(characterId);
}

export function characterImagePath(characterId: string): string {
  return characterRemoteImageUrl(characterId) ?? CHARACTER_FALLBACK_IMAGE;
}

export function getCharacterName(characterId: string): string {
  return CHARACTERS.find((c) => c.id === characterId)?.name ?? displayNameFromId(characterId);
}

export function slugifyPlayerName(name: string): string {
  return name.trim().toLowerCase();
}
