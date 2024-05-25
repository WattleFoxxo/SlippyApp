import { navigateTo, refresh } from "./modules/router.js";
import { Device } from "./modules/device.js";

/* Routes */
import "./modules/routes/nodes.js"
import "./modules/routes/message.js"
import "./modules/routes/channels.js"
import "./modules/routes/maps.js"

export let currentDevice = new Device(0);

function checkval(value) {

}

document.getElementById("connect").addEventListener("click", () => {
    mdui.prompt({
        headline: "Connect to device",
        description: "enter the hostname of the device.",
        confirmText: "Connect",
        cancelText: "Cancel",
        textFieldOptions: {
            value: "http://meshtastic.local",
            required: true,
            inputmode: "url",
            checkValidity: true,            
        },
        onConfirm: (host) => currentDevice.connectHttp(host.replace(/^https?:\/\//, ""), 3000, false, host.startsWith("https")),
        onCancel: () => console.log("Canceled"),
    });
});

export function refreshPage() {
    refresh();
}

document.getElementById("refresh").addEventListener("click", () => {
    console.log(currentDevice);
    refreshPage();
});

window.location.hash = "#nodes";
navigateTo(window.location.hash.slice(1).split("?")[0]);