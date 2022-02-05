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
  API.sendNotification({ body: "URL copied to clipboard", title: "Youtube Music Presence" });
}

async function init() {
  setSettingsHTML(await API.getSettings());
}
