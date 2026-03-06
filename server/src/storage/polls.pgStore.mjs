// polls.pgStore.mjs
// Handles PostgreSQL queries for polls.

import { pool } from "./db.mjs";

export async function getPollById(id) {
  const result = await pool.query(
    `SELECT id, owner_id, title, description, created_at
     FROM polls
     WHERE id = $1`,
    [id],
  );

  return result.rows[0] ?? null;
}

export async function insertPoll({ ownerId, title, description = "" }) {
  const result = await pool.query(
    `INSERT INTO polls (owner_id, title, description)
     VALUES ($1, $2, $3)
     RETURNING id, owner_id, title, description, created_at`,
    [ownerId, title, description],
  );

  return result.rows[0];
}

export async function listPollRows() {
  const result = await pool.query(
    `SELECT id, owner_id, title, description, created_at
     FROM polls
     ORDER BY created_at DESC`,
  );

  return result.rows;
}