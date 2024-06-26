import * as router from "./modules/router.js";
import { Device } from "./device.js";
import { DeviceStatus, AppStorage } from "./modules/utils.js";

import "./modules/routes/nodes.js"
import "./modules/routes/channels.js"
import "./modules/routes/message.js"
import "./modules/routes/maps.js"
import "./modules/routes/settings.js"

export let globalDevice = new Device();

export let deviceStorage = new AppStorage("deviceStorage");
export let settingStorage = new AppStorage("settingStorage");

import { initSettings } from "./modules/settings_manager.js";
import { initSave, loadDevice } from "./modules/save_manager.js";
import { initNoitif } from "./modules/notification_manager.js"

initSettings();
initNoitif();
// initSave();
// loadDevice();

document.getElementById("index.quick-menu.refresh").addEventListener("refresh", () => router.refreshPage());

window.location.hash = "#nodes";
router.navigateTo("nodes");

if ("serviceWorker" in navigator) {
    await navigator.serviceWorker.register("service-worker.js", {
        type: "module",
    });
}