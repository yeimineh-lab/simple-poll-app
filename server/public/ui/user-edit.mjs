import { userStore } from "../data/userStore.mjs";

class UserEdit extends HTMLElement {
  #onChange;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.#onChange = () => this.render();
  }

  connectedCallback() {
    userStore.addEventListener("change", this.#onChange);
    this.render();
  }

  disconnectedCallback() {
    userStore.removeEventListener("change", this.#onChange);
  }

  render() {
    const { status, token, me } = userStore.state;
    const loggedIn = Boolean(token);

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="../app.css">
      <section class="panel">
        <h2>Logg inn / Rediger</h2>

        <form id="login">
          <label>Username</label>
          <input name="username" type="text" minlength="3" required />

          <label>Password</label>
          <input name="password" type="password" minlength="8" required />

          <div class="row" style="margin-top:12px">
            <button class="primary" type="submit" ${status === "loading" ? "disabled" : ""}>Login</button>
            <button type="button" id="meBtn" ${!loggedIn || status === "loading" ? "disabled" : ""}>Reload /me</button>
            <button type="button" id="logoutBtn" ${!loggedIn || status === "loading" ? "disabled" : ""}>Logout</button>
          </div>

          <small class="muted">
            Kaller: <code>POST /api/v1/auth/login</code>, <code>GET /api/v1/auth/me</code>, <code>POST /api/v1/auth/logout</code>
          </small>
        </form>

        <hr />

        <form id="edit">
          <div class="muted">Innlogget som: <code>${me?.username ?? "-"}</code></div>

          <label>Ny username (valgfritt)</label>
          <input name="newUsername" type="text" minlength="3" />

          <label>Nytt password (valgfritt)</label>
          <input name="newPassword" type="password" minlength="8" />

          <div class="row" style="margin-top:12px">
            <button class="primary" type="submit" ${!loggedIn || status === "loading" ? "disabled" : ""}>Save changes</button>
          </div>

          <small class="muted">Kaller: <code>PATCH /api/v1/users/me</code></small>
        </form>
      </section>
    `;

    this.shadowRoot.querySelector("#login").onsubmit = async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);

      await userStore.login({
        username: String(fd.get("username") || ""),
        password: String(fd.get("password") || ""),
      });
    };

    this.shadowRoot.querySelector("#meBtn").onclick = () => userStore.loadMe();
    this.shadowRoot.querySelector("#logoutBtn").onclick = () => userStore.logout();

    this.shadowRoot.querySelector("#edit").onsubmit = async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);

      const username = String(fd.get("newUsername") || "").trim();
      const password = String(fd.get("newPassword") || "").trim();

      const patch = {
        ...(username ? { username } : {}),
        ...(password ? { password } : {}),
      };

      if (Object.keys(patch).length === 0) return;

      await userStore.updateMe(patch);
      e.target.reset();
    };
  }
}

customElements.define("user-edit", UserEdit);
