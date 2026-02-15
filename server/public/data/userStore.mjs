import { request } from "./api.mjs";

/**
 * Minimal store med observer pattern (EventTarget).
 * UI lytter pÃ¥ "change" og re-renderer.
 */
class UserStore extends EventTarget {
  state = {
    token: null,
    me: null,
    status: "idle",
    error: null,
  };

  #set(patch) {
    this.state = { ...this.state, ...patch };
    this.dispatchEvent(new Event("change"));
  }

  async signup(payload) {
    this.#set({ status: "loading", error: null });
    try {
      const created = await request("/api/v1/users", { method: "POST", body: payload });
      this.#set({ status: "idle" });
      return created;
    } catch (e) {
      this.#set({ status: "error", error: e?.message ?? String(e) });
      throw e;
    }
  }

  async login(payload) {
    this.#set({ status: "loading", error: null });
    try {
      const data = await request("/api/v1/auth/login", { method: "POST", body: payload });
      this.#set({ token: data.token, me: data.user, status: "idle" });
      return data;
    } catch (e) {
      this.#set({ status: "error", error: e?.message ?? String(e) });
      throw e;
    }
  }

  async loadMe() {
    if (!this.state.token) return null;
    this.#set({ status: "loading", error: null });
    try {
      const me = await request("/api/v1/auth/me", { token: this.state.token });
      this.#set({ me, status: "idle" });
      return me;
    } catch (e) {
      this.#set({ status: "error", error: e?.message ?? String(e) });
      throw e;
    }
  }

  async logout() {
    if (!this.state.token) return;
    this.#set({ status: "loading", error: null });
    try {
      await request("/api/v1/auth/logout", { method: "POST", token: this.state.token });
      this.#set({ token: null, me: null, status: "idle" });
    } catch (e) {
      this.#set({ status: "error", error: e?.message ?? String(e) });
      throw e;
    }
  }

  async updateMe(patch) {
    if (!this.state.token) throw new Error("Du mÃ¥ vÃ¦re logget inn for Ã¥ redigere.");
    this.#set({ status: "loading", error: null });
    try {
      const me = await request("/api/v1/users/me", {
        method: "PATCH",
        body: patch,
        token: this.state.token,
      });
      this.#set({ me, status: "idle" });
      return me;
    } catch (e) {
      this.#set({ status: "error", error: e?.message ?? String(e) });
      throw e;
    }
  }

  async deleteMe() {
    if (!this.state.token) throw new Error("Du mÃ¥ vÃ¦re logget inn for Ã¥ slette konto.");
    this.#set({ status: "loading", error: null });
    try {
      const out = await request("/api/v1/users/me", { method: "DELETE", token: this.state.token });
      this.#set({ token: null, me: null, status: "idle" });
      return out;
    } catch (e) {
      this.#set({ status: "error", error: e?.message ?? String(e) });
      throw e;
    }
  }
}

export const userStore = new UserStore();
