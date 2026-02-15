import { userStore } from "./data/userStore.mjs";
import "./ui/user-create.mjs";
import "./ui/user-edit.mjs";
import "./ui/user-delete.mjs";

const logEl = document.querySelector("#log");

const renderLog = () => {
  const { status, error, token, me } = userStore.state;
  logEl.textContent = JSON.stringify(
    { status, error, token: token ? "(in-memory)" : null, me },
    null,
    2
  );
};

userStore.addEventListener("change", renderLog);
renderLog();
