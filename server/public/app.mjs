// Import the application state store that holds user data and status
import { userStore } from "./data/userStore.mjs";

// Import UI components used in the page
import "./ui/user-create.mjs";
import "./ui/user-edit.mjs";
import "./ui/user-delete.mjs";

// Import shared i18n functions
import { t, detectLanguage } from "./i18n/index.mjs";

// Select the HTML element where system status will be displayed
const statusEl = document.querySelector("#status");

// Store the detected language
const currentLang = detectLanguage();

// Escape HTML characters to prevent XSS
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));
}

// Apply translations to HTML elements using data-i18n attributes
function applyTranslations() {
  // Set the language attribute on the HTML document
  document.documentElement.lang = currentLang;

  // Update the page title
  const titleEl = document.querySelector("title");
  if (titleEl) {
    titleEl.textContent = t("pageTitle");
  }

  // Replace text in elements that contain data-i18n
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;

    // Special case for badge containing an icon
    if (key === "localBadge") {
      element.innerHTML = `<span class="dot"></span> ${escapeHtml(t(key))}`;
      return;
    }

    element.textContent = t(key);
  });
}

// Render the application status panel
function renderStatus() {
  if (!statusEl) return;

  // Read current state from the store
  const { status, error, token, me, lastAction } = userStore.state;

  // Create a formatted status object
  const pretty = {
    status,
    error,
    token: token ? t("inMemory") : null,
    me,
    lastAction: lastAction ?? null,
    time: new Date().toLocaleTimeString(),
  };

  // Render status HTML
  statusEl.innerHTML = `
    <div class="status-top">
      <span class="pill ${escapeHtml(status)}">${escapeHtml(status)}</span>
      ${
        error
          ? `<span class="pill error">${escapeHtml(t("errorLabel"))}: ${escapeHtml(error)}</span>`
          : `<span class="pill ok">${escapeHtml(t("okLabel"))}</span>`
      }
    </div>
    <pre class="status-pre">${escapeHtml(JSON.stringify(pretty, null, 2))}</pre>
  `;
}

// Register the service worker for caching and offline support
async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;

  try {
    await navigator.serviceWorker.register("/service-worker.js");
    console.log("Service worker registered");
  } catch (error) {
    console.error("Service worker registration failed:", error);
  }
}

// Initialize translations, status rendering, and service worker registration
function init() {
  applyTranslations();
  renderStatus();
  registerServiceWorker();
}

// Update the status panel when the store state changes
userStore.addEventListener("change", renderStatus);

// Run the application setup
init();