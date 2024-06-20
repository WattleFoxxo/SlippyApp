import { clamp, scale, XSSEncode } from "../utils.js";
import { registerScript } from "../router.js";
import { Logging } from "../definitions.js";

import { currentDevice } from "../../index.js";

function loadNodes(device) {
    let channelList = document.getElementById("channels/channel-list");
    channelList.innerHTML = "";

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

            channelList.appendChild(template.content.cloneNode(true))
        } catch (e) {
            console.log(Logging.error, "Faild to parse node: ", e);
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
