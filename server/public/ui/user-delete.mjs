import { userStore } from "../data/userStore.mjs";

class UserDelete extends HTMLElement {
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
    const { status, token } = userStore.state;
    const loggedIn = Boolean(token);

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="../app.css">
      <section class="panel">
        <h2>Slett konto</h2>
        <p class="muted">Krever innlogging (token i minne).</p>

        <div class="row">
          <button class="danger" id="del" ${!loggedIn || status === "loading" ? "disabled" : ""}>
            Delete my account
          </button>
        </div>

        <small class="muted">Kaller: <code>DELETE /api/v1/users/me</code></small>
      </section>
    `;

    this.shadowRoot.querySelector("#del").onclick = async () => {
      if (!confirm("Er du sikker pÃ¥ at du vil slette kontoen?")) return;
      await userStore.deleteMe();
    };
  }
}

customElements.define("user-delete", UserDelete);
