import { navigateTo, refresh } from "./modules/router.js";
import { Device } from "./modules/device.js";
import { Logging } from "./modules/definitions.js";

/* Routes */
import "./modules/routes/nodes.js"
import "./modules/routes/message.js"
import "./modules/routes/channels.js"
import "./modules/routes/maps.js"
import "./modules/routes/settings.js"

export let currentDevice = new Device(0);

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

document.getElementById("index/quick-menu/connect").addEventListener("click", () => {
    let waitUntillSynced = (() => {
        let progress = mdui.dialog({
            headline: "Connecting",
            body: `<mdui-button loading variant="text" style="color: rgb(var(--mdui-color-on-surface));" full-width>Syncing with device.</mdui-button>`,
        });

        currentDevice.connection.events.onFromRadio.subscribe((data) => {
            if (data.payloadVariant.case == "configCompleteId") progress.open = false;
        });
    });

    let promptHttp = (() => {
        let isSecure = (location.protocol === "https:");

        mdui.dialog({
            headline: "Connect to HTTP device",
            body: `
            <span>Enter the Hostname of the Device.<span><br><br>
            <mdui-text-field id="address_box" label="Hostname" value="meshtastic.local"></mdui-text-field><br><br>
            <mdui-checkbox id="tls_checkbox" ${isSecure ? "checked" : ""}>TLS</mdui-checkbox><br>
            <span id="tls_warning" style="color: rgb(var(--mdui-color-error));" hidden>Disabling TLS while using a secure context might cause issues if your node doesn't have TLS enabled. <a href="https://github.com/WattleFoxxo/SlippyApp/blob/main/README.md">more info</a>.</span>
            `,
            actions: [
                {
                    text: "Cancel",
                },
                {
                    text: "Connect",
                    onClick: async () => {
                        let hostname = document.getElementById("address_box").value;
                        let tls = document.getElementById("tls_checkbox").checked;

                        await currentDevice.connectHttp(hostname, 3000, false, tls);

                        waitUntillSynced();
                    },
                }
            ]
        });

        let checkbox = document.getElementById("tls_checkbox");
        let warning = document.getElementById("tls_warning");

        checkbox.addEventListener("click", () => {
            warning.hidden = !(isSecure && checkbox.checked);
        });
    });
    
    mdui.dialog({
        headline: "Connect to device",
        body: `
        <span>Select connection type<span><br><br>
        <mdui-radio-group id="connect_dialog_selection" value="http">
            <mdui-radio value="http">HTTP</mdui-radio><br>
            <mdui-radio ${navigator.bluetooth ? "" : "disabled"} value="bluetooth">Bluetooth</mdui-radio><br>
            <mdui-radio ${navigator.serial ? "" : "disabled"} value="serial">Serial</mdui-radio>
        </mdui-radio-group>
        `,
        actions: [
            {
                text: "Cancel",
            },
            {
                text: "Ok",
                onClick: async () => {
                    switch (document.getElementById("connect_dialog_selection").value) {
                        case "http":
                            promptHttp();
                            break;
                        case "bluetooth":
                            await currentDevice.connectBluetooth();
                            waitUntillSynced();
                            break;
                        case "serial":
                            await currentDevice.connectSerial();
                            waitUntillSynced();
                            break;
                    }
                },
            }
        ]
    });
});

document.getElementById("index/quick-menu/refresh").addEventListener("click", () => {
    refreshPage();
});

document.getElementById("index/quick-menu/about").addEventListener("click", () => {
    console.log(Logging.info, "Meshtastic:", Meshtastic);
    console.log(Logging.info, "Current device:", currentDevice);
    
    mdui.alert({
        headline: "About Slippy",
        description: "(Hopefully) A User-Friendly Application Created by Wattlefox, Woobie, lockness Ko and Leocatto. Held together by hopes and dreams.",
        confirmText: "Ok",
    });
});

/*  */

window.location.hash = "#nodes";
navigateTo(window.location.hash.slice(1).split("?")[0]);

console.log(Logging.info, "Meshtastic:", Meshtastic);
console.log(Logging.info, "Current device:", currentDevice);