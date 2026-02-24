import express from "express";
import { requireAuth } from "../auth/requireAuth.mjs";
import * as usersService from "../services/users.service.mjs";

const router = express.Router();

// POST /api/v1/users
router.post("/users", async (req, res, next) => {
  try {
    const user = await usersService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/v1/users/me
router.patch("/users/me", requireAuth(), async (req, res, next) => {
  try {
    const result = await usersService.updateMe({
      userId: req.auth.userId,
      body: req.body,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/users/me
router.delete("/users/me", requireAuth(), async (req, res, next) => {
  try {
    const result = await usersService.deleteMe({
      userId: req.auth.userId,
      token: req.auth.token,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;