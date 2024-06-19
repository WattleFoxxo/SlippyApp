import { clamp, scale, XSSEncode } from "../utils.js";
import { registerScript } from "../router.js";
import { currentDevice } from "../../index.js";

export function init() {
    document.getElementById("theme").addEventListener("change", () => {
        document.body.setAttribute("class",document.getElementById("theme").value);
        console.log(document.body.className);
    });    
}

export function refresh() {
}

registerScript("settings", init, refresh);
