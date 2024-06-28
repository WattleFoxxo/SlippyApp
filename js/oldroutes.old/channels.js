import { clamp, scale, XSSEncode, Logging, DeviceStatus } from "../utils.js";
import { registerScript } from "../router.js";
import { globalDevice } from "../../index.js";

function loadChannels() {
    let channelList = document.getElementById("channels.channel-list");
    channelList.innerHTML = "";

    if (globalDevice.status == DeviceStatus.Disconnected) {
        channelList.innerHTML = '<div class="empty-list">No channels are here yet,<br>Try connecting to a device.</div>';
        return false;
    }

    globalDevice.channels.forEach((channel, id) => {
        let template = document.getElementById("channels.channel-list.template");
        let newItem = template.content.cloneNode(true);

        let templateItem = newItem.getElementById("_template.item");
        let templateName = newItem.getElementById("_template.name");
        let templateId = newItem.getElementById("_template.id");

        let name = XSSEncode(channel.settings.name);
        if (channel.settings.name.length <= 0) {
            name = "Public";
        }

        if (channel.role == 0) {
            name = "UNK";
        }

        templateItem.href = `#message?channel=${id}`;
        templateName.innerText = name;
        templateId.innerText = `#${id}`;
        
        channelList.appendChild(newItem);
    });
}

export function init() {
    globalDevice.events.addEventListener("onChannel", () => refresh());

    loadChannels();
}

export function refresh() {
    loadChannels();
}

registerScript("channels", init, refresh);
