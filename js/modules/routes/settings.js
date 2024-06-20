import { clamp, scale, XSSEncode } from "../utils.js";
import { registerScript } from "../router.js";
import { currentDevice } from "../../index.js";

// god forgive me for this - WattleFoxxo
export function cursedFunction() {
    const elements = document.querySelectorAll('.mdui-select-is-silly');
    elements.forEach((element) => {
        element.defaultValue = element.value;

        element.addEventListener("change", () => {
            if (element.value.length <= 0) {
                element.value = (element.defaultValue);
                
                // i dont know why this is fucking nesersary but it wont work any other way
                // if i continue to be a programmer i WILL become an alcaholic
                setTimeout(() => {
                    document.getElementById(element.value).setAttribute("selected", true); 
                }, 0); // why tf do i need a 0 ms delay for this to work 💀
            }
        });
    });
}

export function init() {
    cursedFunction();

    let theme = document.getElementById("settings/appearance/theme");
    theme.addEventListener("change", (e) => {
        mdui.setTheme(theme.value);
    });
    
    let colourTheme = document.getElementById("settings/appearance/colour-theme");
    colourTheme.addEventListener("click", () => {

        let setColourMacro = "document.getElementById('settings/appearance/colour-theme/picker/text').value = ";

        mdui.dialog({
            headline: "Colour Picker",
            body: `
            <h4>Colour Presets</h4>
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
}

export function refresh() {

}

registerScript("settings", init, refresh);
