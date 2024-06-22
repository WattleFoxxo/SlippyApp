import { navigateTo, refresh } from "./modules/router.js";
import { Device } from "./modules/device.js";
import { Logging, AppStorage } from "./modules/utils.js";
import { initSettings } from "./modules/settings_manager.js";

/* Routes */
import "./modules/routes/nodes.js"
import "./modules/routes/message.js"
import "./modules/routes/channels.js"
import "./modules/routes/maps.js"
import "./modules/routes/settings.js"

export let currentDevice = new Device(0);
export let currentSettings = new AppStorage("settings");

initSettings(currentSettings);

export function refreshPage() {
    refresh();
}

document.getElementById("index.quick-menu.refresh").addEventListener("click", () => {
    refreshPage();
});

window.location.hash = "#nodes";
navigateTo(window.location.hash.slice(1).split("?")[0]);

console.log(Logging.info, "Meshtastic:", Meshtastic);
console.log(Logging.info, "Current device:", currentDevice);