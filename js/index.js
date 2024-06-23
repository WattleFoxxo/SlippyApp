// import { navigateTo, refresh } from "./modules/router.js";
// import { Device } from "./modules/device.js";
// import { Logging, AppStorage } from "./modules/utils.js";
// import { initSettings } from "./modules/settings_manager.js";

// /* Routes */
// import "./modules/routes/nodes.js"
// import "./modules/routes/message.js"
// import "./modules/routes/channels.js"
// import "./modules/routes/maps.js"
// import "./modules/routes/settings.js"

// export let currentDevice = new Device(0);
// export let settingsStorage = new AppStorage("settings");
// export let deviceStorage = new AppStorage("device");

// initSettings(settingsStorage);

// let messageStorage = deviceStorage.getItem("messages");
// if (messageStorage) currentDevice.messages = JSON.parse(messageStorage);

// // WTF IS THIS
// export function refreshPage() { refresh() }

// document.getElementById("index.quick-menu.refresh").addEventListener("click", () => {
//     refreshPage();
// });

// window.location.hash = "#nodes";
// navigateTo(window.location.hash.slice(1).split("?")[0]);

// if ("serviceWorker" in navigator) {
//     await navigator.serviceWorker.register("service-worker.js", {
//         type: "module",
//     });
// }

import * as router from "./modules/router.js";
import { Device } from "./device.js";
import { DeviceStatus } from "./modules/utils.js";
// import { initSettings } from "./modules/settings_manager.js";

import "./modules/routes/nodes.js"
// import "./modules/routes/message.js"
// import "./modules/routes/channels.js"
// import "./modules/routes/maps.js"
// import "./modules/routes/settings.js"

export let globalDevice = new Device();

globalDevice.connect();

globalDevice.events.addEventListener("onStatus", (status) => {
    console.log("onStatus", status);

    if (status == DeviceStatus.Configured) console.log("Connected!");
})

window.location.hash = "#nodes";
router.navigateTo("nodes");

// initSettings();

if ("serviceWorker" in navigator) {
    await navigator.serviceWorker.register("service-worker.js", {
        type: "module",
    });
}