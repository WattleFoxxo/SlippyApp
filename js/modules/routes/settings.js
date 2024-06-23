import { Logging } from "../utils.js";
import { registerScript } from "../router.js";
import { settingsStorage } from "../../index.js";
import { settingMap } from "../settings_manager.js";
import { VERSION } from "../definitions.js";


// god forgive me for this - WattleFoxxo
function cursedFunction() {
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

function colourPickerPrompt(element) {
    let setColourMacro = "document.getElementById('_colour-picker.textbox').value = ";

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
        <mdui-text-field required id="_colour-picker.textbox" variant="outlined" placeholder="eg. #000000" value="${element.value}"></mdui-text-field>
        `,
        actions: [
            {
                text: "Cancel",
            },
            {
                text: "Ok",
                onClick: (e) => {
                    let colour = document.getElementById("_colour-picker.textbox").value;
                    if (colour.length <= 0) return false;

                    element.value = colour
                    element.dispatchEvent(new Event("change"));
                },
            }
        ],
    });
}

function htmlFromItem(key, object) {
    let item = object.ui;
    let itemHtml = "";

    switch (item.type) {
        case "text":
            itemHtml = `
                <div>
                    <mdui-text-field
                        id="settings.${key}"
                        label="${item.label}"
                        variant="outlined"
                        value="${settingsStorage.getItem(key)}"
                    ></mdui-text-field>
                </div>
            `;
            break
        
        case "dropdown":
            let dropdownHTML = "";

            item.options.forEach((item) => {
                dropdownHTML += `
                    <mdui-menu-item
                        value="${item.value}"
                    >${item.label}</mdui-menu-item>
                `;
            });

            itemHtml = `
                <div>
                    <mdui-select
                        id="settings.${key}"
                        class="mdui-select-is-silly"
                        label="${item.label}"
                        variant="outlined"
                        end-icon="arrow_drop_down"
                        value="${settingsStorage.getItem(key)}"
                    >
                        ${dropdownHTML}
                    </mdui-select>
                </div>
            `;
            break
        
        case "colour":
            itemHtml = `
                <div>
                    <mdui-text-field
                        id="settings.${key}"
                        readonly
                        end-icon="color_lens"
                        label="${item.label}"
                        variant="outlined"
                        value="${settingsStorage.getItem(key)}"
                    ></mdui-text-field>
                </div>
            `;
            break
        
        case "button":
            itemHtml = `
                <div>
                    <mdui-button
                        id="settings.${key}"
                        variant="outlined"
                        full-width
                        ${item.disabled?"disabled":""}
                    >${item.label}</mdui-button>
                </div>
            `;
            break
        
        case "category":
            itemHtml = `
                <br><h2 id="settings.${key}">${item.label}</h2>
            `;
            break
        
    }

    return itemHtml;
}

function postItemCreation(key, object, element) {
    if (object.onChange) element.addEventListener("change", () => settingsStorage.setItem(key, element.value));
    if (object.onClick) element.addEventListener("click", object.onClick);
    
    switch (object.ui.type) {
        case "colour":
            element.addEventListener("click", () => colourPickerPrompt(element));
            break
    }
}


export function init() {
    cursedFunction();

    let settingsList = document.getElementById("settings.setting-list");

    Object.entries(settingMap).forEach(([key, object]) => {
        let template = document.createElement("template");
        template.innerHTML = htmlFromItem(key, object);
        settingsList.appendChild(template.content.cloneNode(true))

        let element = document.getElementById(`settings.${key}`);
        if (element) postItemCreation(key, object, element);
    });

    let versionString = document.createElement("template");
    versionString.innerHTML = `
        <br><div
            style="font-size: small; text-align: center;"
        >
            Slippy app version ${VERSION} <a href="https://github.com/WattleFoxxo/SlippyApp">Github</a>
        </div>
    `;
    
    settingsList.appendChild(versionString.content.cloneNode(true))
}

export function refresh() {

}

registerScript("settings", init, refresh);
