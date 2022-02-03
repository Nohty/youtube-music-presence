document.addEventListener("DOMContentLoaded", init);

const port = document.querySelector<HTMLInputElement>("#input-port");
const enabled = document.querySelector<HTMLButtonElement>("#button-status");
const url = document.querySelector<HTMLAnchorElement>("#url");
const alertE = document.querySelector<HTMLDivElement>("#alert");

port.addEventListener("change", handleInputChange);
enabled.addEventListener("click", handleButtonClick);
url.addEventListener("click", handleUrlClick);

function setSettingsHTML(settings: SettingsType) {
  port.value = settings.port.toString();
  enabled.textContent = settings.enabled ? "Disable" : "Enable";
  url.href = `http://localhost:${settings.port}`;
  url.textContent = `http://localhost:${settings.port}`;
}

function getSettingsHTML(): SettingsType {
  return {
    port: parseInt(port.value) || 3002,
    enabled: enabled.textContent === "Disable",
  };
}

function handleInputChange(e: Event) {
  e.preventDefault();
  const settings = getSettingsHTML();
  setSettingsHTML(settings);
  API.setSettings(settings);
}

function handleButtonClick(e: Event) {
  e.preventDefault();
  const settings = { ...getSettingsHTML(), enabled: !getSettingsHTML().enabled };
  setSettingsHTML(settings);
  API.setSettings(settings);
}

function handleUrlClick(e: Event) {
  e.preventDefault();
  navigator.clipboard.writeText(url.href);
  showAlert();
}

function showAlert() {
  alertE.innerHTML = alertHTML;
  setTimeout(() => (alertE.innerHTML = ""), 3000);
}

async function init() {
  setSettingsHTML(await API.getSettings());
}

const alertHTML = `<svg xmlns="http://www.w3.org/2000/svg" style="display: none">
<symbol id="check-circle-fill" fill="currentColor" viewBox="0 0 16 16">
  <path
    d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"
  />
</symbol>
</svg>
<div class="alert alert-success d-flex align-items-center" role="alert">
<svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Success:">
  <use xlink:href="#check-circle-fill" />
</svg>
<div>Url copied to clipboard</div>
</div>`;
