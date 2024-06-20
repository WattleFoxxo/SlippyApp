import { clamp, scale, XSSEncode } from "../utils.js";
import { registerScript } from "../router.js";
import { currentDevice } from "../../index.js";
import { Logging } from "../definitions.js";

// god forgive me for this - WattleFoxxo
export function cursedFunction() {
    const elements = document.querySelectorAll('.mdui-select-is-silly');
    elements.forEach((element) => {
        element.defaultValue = element.value;

        element.addEventListener("change", () => {
            if (element.value.length <= 0) {
                element.value = element.defaultValue;
                
                // i dont know why this is fucking nesersary but it wont work any other way
                // if i continue to be a programmer i WILL become an alcaholic
                setTimeout(() => {
                    Array.from(element.children).forEach((child) => {
                        if (child.value == element.value) child.setAttribute("selected", true); 
                    });
                }, 0); // why tf do i need a 0 ms delay for this to work 💀

                return false;
            }

            element.defaultValue = element.value;
        });
    });
}

export function init() {
    cursedFunction();

    let theme = document.getElementById("settings/appearance/theme");
    theme.addEventListener("change", () => {
        mdui.setTheme(theme.value);
    });
    
    let colourTheme = document.getElementById("settings/appearance/colour-theme");
    colourTheme.addEventListener("click", () => {

        let setColourMacro = "document.getElementById('settings/appearance/colour-theme/picker/text').value = ";

        mdui.dialog({
            headline: "Colour Picker",
            body: `
            <h4>Presets</h4>
            <mdui-button-icon style="background-color: #f44336;" onclick="${setColourMacro}'#f44336'"></mdui-button-icon>
            <mdui-button-icon style="background-color: #e91e63;" onclick="${setColourMacro}'#e91e63'"></mdui-button-icon>
            <mdui-button-icon style="background-color: #9c27b0;" onclick="${setColourMacro}'#9c27b0'"></mdui-button-icon>
            <mdui-button-icon style="background-color: #673ab7;" onclick="${setColourMacro}'#673ab7'"></mdui-button-icon>
            <mdui-button-icon style="background-color: #3f51b5;" onclick="${setColourMacro}'#3f51b5'"></mdui-button-icon>
            <mdui-button-icon style="background-color: #2196f3;" onclick="${setColourMacro}'#2196f3'"></mdui-button-icon>
            <mdui-button-icon style="background-color: #03a9f4;" onclick="${setColourMacro}'#03a9f4'"></mdui-button-icon>
            <mdui-button-icon style="background-color: #00bcd4;" onclick="${setColourMacro}'#00bcd4'"></mdui-button-icon>
            <mdui-button-icon style="background-color: #009688;" onclick="${setColourMacro}'#009688'"></mdui-button-icon>
            <mdui-button-icon style="background-color: #4caf50;" onclick="${setColourMacro}'#4caf50'"></mdui-button-icon>
            <mdui-button-icon style="background-color: #8bc34a;" onclick="${setColourMacro}'#8bc34a'"></mdui-button-icon>
            <mdui-button-icon style="background-color: #cddc39;" onclick="${setColourMacro}'#cddc39'"></mdui-button-icon>
            <mdui-button-icon style="background-color: #ffeb3b;" onclick="${setColourMacro}'#ffeb3b'"></mdui-button-icon>
            <mdui-button-icon style="background-color: #ffc107;" onclick="${setColourMacro}'#ffc107'"></mdui-button-icon>
            <mdui-button-icon style="background-color: #ff9800;" onclick="${setColourMacro}'#ff9800'"></mdui-button-icon>
            <mdui-button-icon style="background-color: #ff5722;" onclick="${setColourMacro}'#ff5722'"></mdui-button-icon>
            <mdui-button-icon style="background-color: #795548;" onclick="${setColourMacro}'#795548'"></mdui-button-icon>
            <h4>Custom</h4>
            <mdui-text-field required id="settings/appearance/colour-theme/picker/text" variant="outlined" placeholder="eg. #000000" value="${colourTheme.value}"></mdui-text-field>
            `,
            actions: [
                {
                    text: "Cancel",
                },
                {
                    text: "Ok",
                    onClick: (e) => {
                        let colour = document.getElementById("settings/appearance/colour-theme/picker/text").value;

                        if (colour.length <= 0) return false;

                        colourTheme.value = colour
                        mdui.setColorScheme(colour);
                    },
                }
            ]
        });
    });

    /* Radio */
    let radioConnect = document.getElementById("settings/radio/connect");
    radioConnect.addEventListener("click", () => {
        let waitUntillSynced = (() => {
            let progress = mdui.dialog({
                headline: "Connecting",
                body: `<mdui-button loading variant="text" style="color: rgb(var(--mdui-color-on-surface));" full-width>Syncing with device.</mdui-button>`,
            });
    
            currentDevice.connection.events.onFromRadio.subscribe((data) => {
                if (data.payloadVariant.case == "configCompleteId") progress.open = false;
                radioConnect.disabled = true;
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
    });

    /* Other */
    let otherAbout = document.getElementById("settings/other/about");
    otherAbout.addEventListener("click", () => {
        console.log(Logging.info, "Meshtastic:", Meshtastic);
        console.log(Logging.info, "Current device:", currentDevice);
        
        mdui.alert({
            headline: "About Slippy",
            description: "(Hopefully) A User-Friendly Application Created by Wattlefox, Woobie, lockness Ko and Leocatto. Held together by hopes and dreams.",
            confirmText: "Ok",
        });
    });
}

export function refresh() {

}

registerScript("settings", init, refresh);
