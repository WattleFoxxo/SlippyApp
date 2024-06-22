import { currentDevice, deviceStorage } from "../index.js";
import { Logging } from "./utils.js";

function appearanceTheme(value) {
    mdui.setTheme(value);
}

function appearanceColourTheme(value) {
    mdui.setColorScheme(value);
}

// Buttons

function radioConnect() {
    let waitUntillSynced = (() => {
        let progress = mdui.dialog({
            headline: "Connecting",
            body: `<mdui-button loading variant="text" style="color: rgb(var(--mdui-color-on-surface));" full-width>Syncing with device.</mdui-button>`,
        });

        currentDevice.connection.events.onFromRadio.subscribe((data) => {
            if (data.payloadVariant.case) {
                if (data.payloadVariant.case == "configCompleteId") {
                    progress.open = false;
                    document.getElementById("settings.radio.connect").getAttribute("disabled", true);
                    settingMap["radio.connect"].ui["disabled"] = true;
                }
            }
        });
    });

    let promptHttp = (() => {
        let isSecure = (location.protocol === "https:");

        mdui.dialog({
            headline: "Connect to HTTP device",
            body: `
            <span>Enter the Hostname of the Device.<span><br><br>
            <mdui-text-field id="address_box" variant="outlined" label="Hostname" value="meshtastic.local"></mdui-text-field><br><br>
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
}

function otherAbout() {
    mdui.dialog({
        headline: "About Slippy",
        body: `
            <p>(Hopefully) A user-friendly Meshtastic compatable application created by: Wattlefox, Woobie, Leo-Catto and lockness Ko.</p>
            <p>Made for and by the Canberra Meshtastic Community.</p>
        `,
        actions: [
            {
                text: "Ok",
            },
        ],
    });
}

function otherDebug() {

}

function otherDeleteMessages() {
    mdui.dialog({
        headline: "Delete Messages",
        body: `
            <span style="color: rgb(var(--mdui-color-error))">
                Are you sure?<br><br>
                <b>Doing this will delete ALL messages on THIS device!<b>
            </span>
        `,
        actions: [
            {
                text: "No",
            },
            {
                text: "Yes",
                onClick: () => {
                    currentDevice.messages = {};
                    deviceStorage.setItem("messages", JSON.stringify(currentDevice.messages));

                    mdui.snackbar({ message: "Successfully deleted all messages!" });
                },
            },
        ],
    });
}

function otherDeleteAll() {
    mdui.dialog({
        headline: "Delete Everything",
        body: `
            <span style="color: rgb(var(--mdui-color-error))">
                Are you sure?<br><br>
                <b>Doing this will delete EVERYTHING including: Messages, Nodes, Favorites and Settings!<b>
            </span>
        `,
        actions: [
            {
                text: "No",
            },
            {
                text: "Yes",
                onClick: () => {
                    localStorage.clear();
                    
                    try {
                        navigator.app.exitApp();
                    } catch {
                        console.log(Logging.warn, "Faild to run navigator.app.exitApp() this probably means your running in the browser.")
                    }

                    mdui.dialog({
                        headline: "Restart",
                        body: "Please restart this app to continue.",
                    });
                },
            },
        ],
    });
}

function otherRequestPermissions() {

}

export const settingMap = {
    // Appearance
    "appearance.category": {
        "ui": {
            "type": "category",
            "label": "&#xf027c Appearance",
        },
    },
    "appearance.theme": {
        "onChange": appearanceTheme,
        "defaultValue": "auto",
        "ui": {
            "type": "dropdown",
            "label": "Theme",
            "options": [
                {"label": "Light", "value": "light"},
                {"label": "Dark", "value": "dark"},
                {"label": "System", "value": "auto"},
            ],
        },
    },
    "appearance.colour-theme": {
        "onChange": appearanceColourTheme,
        "defaultValue": "#673ab7",
        "ui": {
            "type": "colour",
            "label": "Colour Theme",
        },
    },
    
    // Radio
    "radio.category": {
        "ui": {
            "type": "category",
            "label": "&#xf043b Radio",
        },
    },
    "radio.connect": {
        "onClick": radioConnect,
        "ui": {
            "type": "button",
            "label": "Connect",
        },
    },

    // Other
    "other.category": {
        "ui": {
            "type": "category",
            "label": "&#xf0831 Other",
        },
    },
    "other.request-permissions": {
        "onClick": otherRequestPermissions,
        "ui": {
            "type": "button",
            "label": "Request Permissions",
        },
    },
    "other.delete-messages": {
        "onClick": otherDeleteMessages,
        "ui": {
            "type": "button",
            "label": "Delete Messages",
        },
    },
    "other.delete-all": {
        "onClick": otherDeleteAll,
        "ui": {
            "type": "button",
            "label": "Delete Everything",
        },
    },
    "other.debug": {
        "onClick": otherDebug,
        "ui": {
            "type": "button",
            "label": "Debug",
            "disabled": true,
        },
    },
    "other.about": {
        "onClick": otherAbout,
        "ui": {
            "type": "button",
            "label": "About",
        },
    },
}

export function initSettings(settingStorage) {      
    Object.entries(settingMap).forEach(([key, object]) => {
        if (object.onChange) {
            settingStorage.onSetItem.addEventListener(key, object.onChange);
            
            let value = settingStorage.getItem(key);
            if (value) {
                object.onChange(value);
            }
        }

        if (object.defaultValue) {
            let value = settingStorage.getItem(key);
            if (!value) {
                settingStorage.setItem(key, object.defaultValue);
            }
        }
    });
}