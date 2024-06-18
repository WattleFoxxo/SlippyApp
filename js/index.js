import { navigateTo, refresh } from "./modules/router.js";
import { Device } from "./modules/device.js";
import { Logging } from "./modules/definitions.js";

/* Routes */
import "./modules/routes/nodes.js"
import "./modules/routes/message.js"
import "./modules/routes/channels.js"
import "./modules/routes/maps.js"

export let currentDevice = new Device(0);

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

document.getElementById("connect").addEventListener("click", () => {
    function prompt_http() {

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
                    text: "Cancel"
                },
                {
                    text: "Connect",
                    onClick: () => {
                        let hostname = document.getElementById("address_box").value;
                        let tls = document.getElementById("tls_checkbox").checked;

                        currentDevice.connectHttp(hostname, 3000, false, tls);
                    }
                }
            ]
        });

        let checkbox = document.getElementById("tls_checkbox");
        let warning = document.getElementById("tls_warning");

        checkbox.addEventListener("click", () => {
            warning.hidden = !(isSecure && checkbox.checked);
        });
    }
    
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
                text: "Cancel"
            },
            {
                text: "Ok",
                onClick: () => {
                    switch (document.getElementById("connect_dialog_selection").value) {
                        case "http":
                            prompt_http();
                            break;
                        case "bluetooth":
                            currentDevice.connectBluetooth();
                            break;
                        case "serial":
                            currentDevice.connectSerial();
                            break;
                    }

                }
            }
        ]
    });
});

export function refreshPage() {
    refresh();
}

document.getElementById("refresh").addEventListener("click", () => {
    refreshPage();
});

document.getElementById("about").addEventListener("click", () => {
    console.log(Logging.info, "Meshtastic:", Meshtastic);
    console.log(Logging.info, "Current device:", currentDevice);
    
    mdui.alert({
        headline: "About Slippy",
        description: "Created by Wattlefox, Woobie, lockness Ko and Leocatto",
        confirmText: "Ok",
    });
});

window.location.hash = "#nodes";
navigateTo(window.location.hash.slice(1).split("?")[0]);

console.log(Logging.info, "Meshtastic:", Meshtastic);
console.log(Logging.info, "Current device:", currentDevice);