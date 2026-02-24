import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createJsonStore } from "../storage/jsonStore.mjs";
import { ValidationError, NotFoundError } from "../domain/errors.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pollsFile = path.join(__dirname, "..", "..", "data", "polls.json");
const usersFile = path.join(__dirname, "..", "..", "data", "users.json");

const pollsStore = createJsonStore(pollsFile, []);
const usersStore = createJsonStore(usersFile, []);

function normalizeTitle(t) {
  return String(t ?? "").trim();
}

function normalizeOptions(options) {
  if (!Array.isArray(options)) return [];

  return options
    .map((o) => (typeof o === "string" ? o : o?.text))
    .map((t) => String(t ?? "").trim())
    .filter(Boolean);
}

export async function listPolls() {
  const polls = await pollsStore.read();
  return { polls };
}

export async function createPoll({ body, userId }) {
  const title = normalizeTitle(body?.title);
  const normalizedOptions = normalizeOptions(body?.options);

  if (!title || title.length < 3) {
    throw new ValidationError("Poll title must be at least 3 characters.");
  }

  if (normalizedOptions.length < 2) {
    throw new ValidationError("Poll must have at least 2 valid options.");
  }

  const [polls, users] = await Promise.all([pollsStore.read(), usersStore.read()]);
  const owner = users.find((u) => u.id === userId);

  if (!owner) {
    // This usually means token references a deleted user
    throw new NotFoundError("User not found");
  }

  const poll = {
    id: crypto.randomUUID(),
    title,
    options: normalizedOptions.map((text) => ({
      id: crypto.randomUUID(),
      text,
      votes: 0,
    })),
    createdAt: new Date().toISOString(),
    ownerId: userId,
    ownerUsername: owner.username,
  };

  polls.push(poll);
  await pollsStore.write(polls);

  return { poll };
}