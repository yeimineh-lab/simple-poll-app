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