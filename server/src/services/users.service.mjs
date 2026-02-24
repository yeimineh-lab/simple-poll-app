import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createJsonStore } from "../storage/jsonStore.mjs";
import { deleteSession } from "../auth/sessions.mjs";
import { ValidationError, ConflictError, NotFoundError } from "../domain/errors.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const usersFile = path.join(__dirname, "..", "..", "data", "users.json");
const pollsFile = path.join(__dirname, "..", "..", "data", "polls.json");

const usersStore = createJsonStore(usersFile, []);
const pollsStore = createJsonStore(pollsFile, []);

function normalizeUsername(u) {
  return String(u || "").trim().toLowerCase();
}

export async function createUser(input) {
  const username = normalizeUsername(input.username);
  const password = String(input.password || "");
  const tosAccepted = Boolean(input.tosAccepted);

  if (!username || username.length < 3) {
    throw new ValidationError("Username must be at least 3 characters.");
  }

  if (!password || password.length < 8) {
    throw new ValidationError("Password must be at least 8 characters.");
  }

  if (!tosAccepted) {
    throw new ValidationError("You must accept the Terms of Service.");
  }

  const users = await usersStore.read();

  if (users.some((u) => u.username === username)) {
    throw new ConflictError("Username already exists.");
  }

  const now = new Date().toISOString();
  const passwordHash = await bcrypt.hash(password, 12);

  const user = {
    id: crypto.randomUUID(),
    username,
    passwordHash,
    createdAt: now,
    consent: {
      tosAcceptedAt: now,
      tosVersion: "v1",
      privacyAcceptedAt: now,
      privacyVersion: "v1",
    },
  };

  users.push(user);
  await usersStore.write(users);

  return {
    id: user.id,
    username: user.username,
    createdAt: user.createdAt,
    consent: user.consent,
  };
}

export async function deleteMe({ userId, token }) {
  const users = await usersStore.read();
  const remaining = users.filter((u) => u.id !== userId);

  await usersStore.write(remaining);

  const polls = await pollsStore.read();
  const updated = polls.map((p) =>
    p.ownerId === userId
      ? { ...p, ownerId: null, ownerUsername: "deleted-user" }
      : p
  );

  await pollsStore.write(updated);

  deleteSession(token);

  return { ok: true };
}

export async function updateMe({ userId, body }) {
  const patchUsernameRaw = body?.username;
  const patchPasswordRaw = body?.password;

  const patchUsername =
    patchUsernameRaw != null ? normalizeUsername(patchUsernameRaw) : null;
  const patchPassword =
    patchPasswordRaw != null ? String(patchPasswordRaw) : null;

  if (patchUsername !== null && patchUsername.length > 0 && patchUsername.length < 3) {
    throw new ValidationError("Username must be at least 3 characters.");
  }

  if (patchPassword !== null && patchPassword.length > 0 && patchPassword.length < 8) {
    throw new ValidationError("Password must be at least 8 characters.");
  }

  const users = await usersStore.read();
  const i = users.findIndex((u) => u.id === userId);
  if (i === -1) throw new NotFoundError("User not found");

  const user = users[i];
  const oldUsername = user.username;

  // Bytte username (må være unik)
  if (patchUsername && patchUsername !== oldUsername) {
    if (users.some((u) => u.username === patchUsername && u.id !== userId)) {
      throw new ConflictError("Username already exists.");
    }
    user.username = patchUsername;
  }

  // Bytte passord
  if (patchPassword) {
    user.passwordHash = await bcrypt.hash(patchPassword, 12);
  }

  users[i] = user;
  await usersStore.write(users);

  // Hvis username endret, oppdater polls som eies av brukeren
  if (user.username !== oldUsername) {
    const polls = await pollsStore.read();
    const updated = polls.map((p) =>
      p.ownerId === userId ? { ...p, ownerUsername: user.username } : p
    );
    await pollsStore.write(updated);
  }

  return {
    id: user.id,
    username: user.username,
    createdAt: user.createdAt,
    consent: user.consent,
  };
}