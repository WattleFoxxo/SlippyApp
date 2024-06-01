import { clamp, scale, XSSEncode } from "../utils.js";
import { registerScript } from "../router.js";

import { currentDevice } from "../../index.js";

/**
 * @param {import('../device.js').Device} device 
 */
function loadNodes(device) {
    document.getElementById("channelList").innerHTML = "";

    Object.entries(device.channels).forEach(([channelId, channel]) => {

        try {

            let index = XSSEncode(channel.index);
            let name = XSSEncode((channel.settings.name.length != 0) ? channel.settings.name : "UNK");

            let template = document.createElement("template");
            template.innerHTML = `
            <mdui-list-item icon="people" end-icon="arrow_right" href="#message?channel=${index}" fab-detach>
                ${name} <mdui-badge style="vertical-align: middle;">#${index}</mdui-badge>
            </mdui-list-item>
            `;

            document.getElementById("channelList").appendChild(template.content.cloneNode(true))
        } catch (e) {
            console.log("Faild to parse node: ", e);
        }
    });
}

export function init() {
    loadNodes(currentDevice);
}

export function refresh() {
    loadNodes(currentDevice);
}

registerScript("channels", init, refresh);
