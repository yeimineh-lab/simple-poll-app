import { getSessionUserId } from "../services/sessions.service.mjs";

export function requireAuth() {
  return async (req, res, next) => {
    try {
      const header = req.headers.authorization || "";
      const [type, token] = header.split(" ");

      if (type !== "Bearer" || !token) {
        return res.status(401).json({ error: "Missing or invalid Authorization header" });
      }

      const userId = await getSessionUserId(token);

      if (!userId) {
        return res.status(401).json({ error: "Invalid session" });
      }

      req.auth = { token, userId };
      next();
    } catch (error) {
      next(error);
    }
  };
}