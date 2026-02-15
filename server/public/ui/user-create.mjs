import { userStore } from "../data/userStore.mjs";

class UserCreate extends HTMLElement {
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
    const { status } = userStore.state;

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="../app.css">
      <section class="panel">
        <h2>Opprett bruker</h2>

        <form id="f">
          <label>Username</label>
          <input name="username" type="text" minlength="3" required />

          <label>Password</label>
          <input name="password" type="password" minlength="8" required />

          <label class="row" style="margin-top:10px">
            <input name="tosAccepted" type="checkbox" required />
            <span>Jeg godtar <a href="/TERMS.MD">Terms</a> og <a href="/PRIVACY.MD">Privacy</a></span>
          </label>

          <div class="row" style="margin-top:12px">
            <button class="primary" type="submit" ${status === "loading" ? "disabled" : ""}>Sign up</button>
          </div>

          <small class="muted">Kaller: <code>POST /api/v1/users</code></small>
        </form>
      </section>
    `;

    this.shadowRoot.querySelector("#f").onsubmit = async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);

      await userStore.signup({
        username: String(fd.get("username") || ""),
        password: String(fd.get("password") || ""),
        tosAccepted: Boolean(fd.get("tosAccepted")),
      });

      e.target.reset();
    };
  }
}

customElements.define("user-create", UserCreate);
