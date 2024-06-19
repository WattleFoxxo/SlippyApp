import { clamp, scale, XSSEncode } from "../utils.js";
import { registerScript } from "../router.js";
import { currentDevice } from "../../index.js";

// god forgive me for this - WattleFoxxo
function cursedFunction() {
    const elements = document.querySelectorAll('.mdui-select-default');
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

    let theme_dropdown = document.getElementById("theme");
    theme_dropdown.addEventListener("change", (e) => {
        document.body.setAttribute("class", theme_dropdown.value);
        console.log(document.body.className);

        theme_dropdown.defaultValue = theme_dropdown.value;
    });    
}

export function refresh() {

}

registerScript("settings", init, refresh);
