import { pool } from "../storage/db.mjs";

export async function createSession(token, userId) {
  await pool.query(
    `
      INSERT INTO sessions (token, user_id)
      VALUES ($1, $2)
      ON CONFLICT (token) DO UPDATE
      SET user_id = EXCLUDED.user_id
    `,
    [token, userId],
  );
}

export async function getSessionUserId(token) {
  const result = await pool.query(
    `
      SELECT user_id
      FROM sessions
      WHERE token = $1
      LIMIT 1
    `,
    [token],
  );

  return result.rows[0]?.user_id ?? null;
}

export async function deleteSession(token) {
  await pool.query(
    `
      DELETE FROM sessions
      WHERE token = $1
    `,
    [token],
  );
}