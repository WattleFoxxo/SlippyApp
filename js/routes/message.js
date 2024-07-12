import { Route } from "../modules/route.js";
import { XSSEncode } from "../modules/utils/xss.js";
import { clamp } from "../modules/utils/math.js";

export class MessageRoute extends Route {
    constructor(device, router, messageManager) {
        super("message", "message.html");

        this.device = device;
        this.router = router;
        this.messageManager = messageManager;
    }

    init() {
        let parameters = this.router.getParameters();
        console.log(parameters);

        let messageBox = document.getElementById("message.message-box");
        let sendButton = document.getElementById("message.send-button");

        let channelId = parseInt(parameters.channel);
        let channelName = "UNK";

        if (this.device.status == Meshtastic.Types.DeviceStatusEnum.DeviceDisconnected) {
            messageBox.setAttribute("disabled", true);
        }

        if (channelId < 10) {
            let channel = this.device.channels.get(channelId);
            let name = channel.settings.name;

            channelName = (name.length > 0) ? name : "Public";
            // this.router.setBackUrl("#channels");
        } else {
            let node = this.device.nodes.get(channelId);

            channelName = XSSEncode(`!${channelId.toString(16)}`);
            if ("user" in node) channelName = node.user.longName;

            // this.router.setBackUrl("#nodes");
        }

        this.router.setTitle(`Message ${channelName}`);
        messageBox.setAttribute("label", `Message ${channelName}`);

        sendButton.addEventListener("click", (event) => {
            if (messageBox.value.length == 0) return;

            let dest = channelId;
            let channel = 0;

            if (channelId < 10) {
                dest = "broadcast";
                channel = channelId;
            }

            this.messageManager.sendMessage(messageBox.value, dest, channel);
            messageBox.value = "";
        });

        this.device.events.addEventListener("onMessage", () => this.refresh());
        this.device.events.addEventListener("onMessageStatus", () => this.refresh());
        this.refresh();
    }

    refresh() {
        let parameters = this.router.getParameters();

        this.displayMessages(parseInt(parameters.channel));
    }

    displayMessages(channel) {
        let messageList = document.getElementById("message.message-list");
        messageList.innerHTML = "";

        if (!this.device.messages.has(channel)) return;

        let messages = this.device.messages.get(channel);
        messages.forEach(message => {
            let node = this.device.nodes.get(parseInt(message.from));
            let nodeInfo = this.getNodeInfo(node);

            let content = XSSEncode(message.data);
            let time = new Date(message.rxTime).toLocaleTimeString('en-AU');

            let template = document.createElement("template");
            template.innerHTML = `
            <mdui-list-item alignment="start" active rounded style='padding: 5px; margin: 10px; margin-top: 20px;'>
                <div style="white-space: pre-wrap; text-align: left;">${content}</div>
                <span slot="description">Sent at ${time} by <span style="white-space: nowrap">${nodeInfo.longName} <mdui-badge style="vertical-align: middle;">${nodeInfo.shortName}</mdui-badge></span></span>
                <mdui-avatar slot="icon">${nodeInfo.longName.charAt(0)}</mdui-avatar>
            </mdui-list-item>
            `;

            messageList.appendChild(template.content.cloneNode(true));
        });
    }

    getNodeInfo(node) {
        let nodeInfo = {};

        if (this.hasUserInfo(node)) {
            nodeInfo.longName = XSSEncode(node.user.longName);
            nodeInfo.shortName = XSSEncode(node.user.shortName);
        } else {
            nodeInfo.longName = XSSEncode(`!${id.toString(16)}`);
            nodeInfo.shortName = "UNK";
        }

        if (this.hasLocationInfo(node)) {
            nodeInfo.latitude = parseInt(node.position.latitudeI) * 0.0000001;
            nodeInfo.longitude = parseInt(node.position.longitudeI) * 0.0000001;
        } else {
            nodeInfo.latitude = 0.00000;
            nodeInfo.longitude = 0.00000;
        }

        if (this.hasMetricsInfo(node)) {
            nodeInfo.batteryLevel = clamp(parseInt(node.deviceMetrics.batteryLevel), 0, 100);
        } else {
            nodeInfo.batteryLevel = 0;
        }

        nodeInfo.lastHeard = moment(new Date(node.lastHeard * 1000)).fromNow();

        return nodeInfo;
    }

    hasUserInfo(node) {
        return "user" in node;
    }

    hasLocationInfo(node) {
        return "position" in node;
    }

    hasMetricsInfo(node) {
        return "deviceMetrics" in node;
    }
}
