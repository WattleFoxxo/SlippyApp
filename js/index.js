import { navigateTo, refresh } from "./modules/router.js";
import { Device } from "./modules/device.js";

/* Routes */
import "./modules/routes/nodes.js"
import "./modules/routes/message.js"
import "./modules/routes/channels.js"
import "./modules/routes/maps.js"

export let currentDevice = new Device(0);

window.addEventListener("load", (event) => {
    if (location.protocol === "https:" && !checkCookie("ignore-https-warn")) {
        mdui.dialog({
            headline: "Hold up!",
            body: `
            <span>It looks like you're using a secure connection.<br>
            This might cause issues if your node doesn't have TLS enabled.<br><br>
            Learn more about that <a href="https://github.com/WattleFoxxo/SlippyApp/blob/main/README.md">here</a>.<span>
            `,
            actions: [
                {
                    text: "Don't show again",
                    onClick: () => setCookie("ignore-https-warn", true, 256),
                },
                {
                    text: "Acknowledge"
                }
            ]
        });
    }
});

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

document.getElementById("about").addEventListener("click", () => {
    mdui.alert({
        headline: "About Slippy",
        description: "Created by Wattlefox, Woobie and lockness Ko",
        confirmText: "Ok",
    });
});

window.location.hash = "#nodes";
navigateTo(window.location.hash.slice(1).split("?")[0]);