import { navigateTo } from "./modules/router.js";
import { Device } from "./modules/device.js";

/* Routes */
import "./modules/routes/nodes.js"
import "./modules/routes/message.js"

export let currentDevice = new Device(0);

document.getElementById("connect").addEventListener("click", () => {
    mdui.prompt({
        headline: "Connect to HTTP device",
        description: "enter the hostname of the device",
        confirmText: "Connect",
        cancelText: "Cancel",
        onConfirm: (host) => currentDevice.connectHttp(host),
        onCancel: () => console.log("Canceled"),
    });
});

export function refreshPage() {
    navigateTo(window.location.hash.slice(1).split("?")[0]);
}

document.getElementById("refresh").addEventListener("click", () => {
    refreshPage();
});

window.location.hash = "#nodes";