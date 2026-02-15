import { request } from "./api.mjs";

class UserStore extends EventTarget {
  state = {
    token: null,
    me: null,
    status: "idle",
    error: null,
    lastAction: null,
  };

  #set(patch) {
    this.state = { ...this.state, ...patch };
    this.dispatchEvent(new Event("change"));
  }

  async signup(payload) {
    this.#set({ status: "loading", error: null, lastAction: { name: "signup", endpoint: "POST /api/v1/users" } });
    try {
      const created = await request("/api/v1/users", { method: "POST", body: payload });
      this.#set({ status: "idle", lastAction: { name: "signup", ok: true, result: created } });
      return created;
    } catch (e) {
      this.#set({ status: "error", error: e?.message ?? String(e), lastAction: { name: "signup", ok: false } });
      throw e;
    }
  }

  async login(payload) {
    this.#set({ status: "loading", error: null, lastAction: { name: "login", endpoint: "POST /api/v1/auth/login" } });
    try {
      const data = await request("/api/v1/auth/login", { method: "POST", body: payload });
      this.#set({ token: data.token, me: data.user, status: "idle", lastAction: { name: "login", ok: true, result: data.user } });
      return data;
    } catch (e) {
      this.#set({ status: "error", error: e?.message ?? String(e), lastAction: { name: "login", ok: false } });
      throw e;
    }
  }

  async loadMe() {
    if (!this.state.token) return null;
    this.#set({ status: "loading", error: null, lastAction: { name: "loadMe", endpoint: "GET /api/v1/auth/me" } });
    try {
      const me = await request("/api/v1/auth/me", { token: this.state.token });
      this.#set({ me, status: "idle", lastAction: { name: "loadMe", ok: true, result: me } });
      return me;
    } catch (e) {
      this.#set({ status: "error", error: e?.message ?? String(e), lastAction: { name: "loadMe", ok: false } });
      throw e;
    }
  }

  async logout() {
    if (!this.state.token) return;
    this.#set({ status: "loading", error: null, lastAction: { name: "logout", endpoint: "POST /api/v1/auth/logout" } });
    try {
      await request("/api/v1/auth/logout", { method: "POST", token: this.state.token });
      this.#set({ token: null, me: null, status: "idle", lastAction: { name: "logout", ok: true } });
    } catch (e) {
      this.#set({ status: "error", error: e?.message ?? String(e), lastAction: { name: "logout", ok: false } });
      throw e;
    }
  }

  async updateMe(patch) {
    if (!this.state.token) throw new Error("Du må være logget inn for å redigere.");
    this.#set({ status: "loading", error: null, lastAction: { name: "updateMe", endpoint: "PATCH /api/v1/users/me" } });
    try {
      const me = await request("/api/v1/users/me", {
        method: "PATCH",
        body: patch,
        token: this.state.token,
      });
      this.#set({ me, status: "idle", lastAction: { name: "updateMe", ok: true, result: me } });
      return me;
    } catch (e) {
      this.#set({ status: "error", error: e?.message ?? String(e), lastAction: { name: "updateMe", ok: false } });
      throw e;
    }
  }

  async deleteMe() {
    if (!this.state.token) throw new Error("Du må være logget inn for å slette konto.");
    this.#set({ status: "loading", error: null, lastAction: { name: "deleteMe", endpoint: "DELETE /api/v1/users/me" } });
    try {
      const out = await request("/api/v1/users/me", { method: "DELETE", token: this.state.token });
      this.#set({ token: null, me: null, status: "idle", lastAction: { name: "deleteMe", ok: true, result: out } });
      return out;
    } catch (e) {
      this.#set({ status: "error", error: e?.message ?? String(e), lastAction: { name: "deleteMe", ok: false } });
      throw e;
    }
  }
}

export const userStore = new UserStore();
