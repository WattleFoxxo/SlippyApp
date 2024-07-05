import { Route } from "../modules/route.js";
import { XSSEncode } from "../modules/utils/xss.js";

export class ChannelsRoute extends Route {
    constructor(device) {
        super("channels", "channels.html");

        this.device = device;
    }

    init() {
        this.device.events.addEventListener("onChannel", () => this.refresh());
        this.refresh();
    }

    refresh() {
        this.displayChannels();
    }

    displayChannels() {
        let channelList = document.getElementById("channels.channel-list");
        channelList.innerHTML = "";

        if (!this.device.channels.size) {
            if (this.device.status == Meshtastic.Types.DeviceStatusEnum.DeviceDisconnected) {
                channelList.innerHTML = '<div class="empty-list">No channels are here yet,<br>Try connecting to a device.</div>';
                return;
            }
        }

        this.device.channels.forEach((channel, id) => {
            let template = document.getElementById("channels.channel-list.template");
            let newItem = template.content.cloneNode(true);

            let templateItem = newItem.getElementById("_template.item");
            let templateName = newItem.getElementById("_template.name");
            let templateId = newItem.getElementById("_template.id");

            let name = XSSEncode(channel.settings.name);
            if (channel.settings.name.length <= 0) name = "Public";
            if (channel.role == 0) name = "UNK";

            templateItem.href = `#message?channel=${id}`;
            templateName.innerText = name;
            templateId.innerText = `#${id}`;
            
            channelList.appendChild(newItem);
        });
    }
}
