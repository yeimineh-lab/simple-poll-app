import { userStore } from "./data/userStore.mjs";
import "./ui/user-create.mjs";
import "./ui/user-edit.mjs";
import "./ui/user-delete.mjs";

const statusEl = document.querySelector("#status");

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));
}

function renderStatus() {
  if (!statusEl) return;

  const { status, error, token, me, lastAction } = userStore.state;

  const pretty = {
    status,
    error,
    token: token ? "(in-memory)" : null,
    me,
    lastAction: lastAction ?? null,
    time: new Date().toLocaleTimeString(),
  };

  statusEl.innerHTML = `
    <div class="status-top">
      <span class="pill ${escapeHtml(status)}">${escapeHtml(status)}</span>
      ${error ? `<span class="pill error">Error: ${escapeHtml(error)}</span>` : `<span class="pill ok">OK</span>`}
    </div>
    <pre class="status-pre">${escapeHtml(JSON.stringify(pretty, null, 2))}</pre>
  `;
}

userStore.addEventListener("change", renderStatus);
renderStatus();
