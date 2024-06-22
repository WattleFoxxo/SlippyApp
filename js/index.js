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

window.addEventListener("load", () => {
    // if (location.protocol === "https:" && !checkCookie("ignore-https-warn")) {
    //     mdui.dialog({
    //         headline: "Hold up!",
    //         body: `
    //         <span>It looks like you're using a secure context.<br>
    //         This might cause issues if your node doesn't have TLS enabled.<br><br>
    //         Learn more about that <a href="https://github.com/WattleFoxxo/SlippyApp/blob/main/README.md">here</a>.<span>
    //         `,
    //         actions: [
    //             {
    //                 text: "Don't show again",
    //                 onClick: () => setCookie("ignore-https-warn", true, 256),
    //             },
    //             {
    //                 text: "Acknowledge"
    //             }
    //         ]
    //     });
    // }
});

/* Quick menu */

document.getElementById("index.quick-menu.refresh").addEventListener("click", () => {
    refreshPage();
});

/*  */

window.location.hash = "#nodes";
navigateTo(window.location.hash.slice(1).split("?")[0]);

console.log(Logging.info, "Meshtastic:", Meshtastic);
console.log(Logging.info, "Current device:", currentDevice);