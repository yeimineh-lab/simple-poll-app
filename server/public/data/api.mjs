/**
 * Single fetch gateway â€“ all requests go through here.
 * Relative URLs only.
 *
 * IMPORTANT: This file contains the ONLY fetch() in the client.
 */
export async function request(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const msg =
      data && typeof data === "object" && "error" in data
        ? String(data.error)
        : String(data);
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}
