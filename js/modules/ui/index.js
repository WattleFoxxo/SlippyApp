import { currentDevice } from "../../index.js";
import * as nodes from "./nodes.js";

document.getElementById("topbar/connect").addEventListener("click", () => {
    mdui.prompt({
        headline: "Connect to HTTP device",
        description: "enter the hostname of the device",
        confirmText: "Connect",
        cancelText: "Cancel",
        onConfirm: (host) => currentDevice.connectHttp(host),
        onCancel: () => console.log("Canceled"),
    });
});

// document.getElementById("topbar/connect").addEventListener("click", () => {
//     currentDevice.connectHttp("192.168.0.58");
// });

let navbar = document.getElementById("navbar");
navbar.addEventListener("change", () => {
    let page = document.getElementById(navbar.value);
    let title = document.getElementById("topbar/title");

    document.querySelectorAll(".app-page").forEach(element => {
        element.hidden = true;
    });

    page.hidden = false;

    title.innerText = page.getAttribute("name");
});