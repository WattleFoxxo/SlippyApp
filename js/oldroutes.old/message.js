import { registerScript, setTitle, setBackButtonURL } from "../router.js";
import { globalDevice } from "../../index.js";

function loadMessages(channel) {
    let messageList = document.getElementById("message.message-list");
    messageList.innerHTML = "";

    console.log(Logging.debug, globalDevice.messages);

    if (!globalDevice.messages.has(channel)) {
        console.log(Logging.warn, "No messages in channel: ", channel);
        return false;
    }

    let messages = globalDevice.messages.get(channel);

    console.log(messages);

    messages.forEach(message => {
        console.log(Logging.debug, "Found message: ", message);

        let node = globalDevice.nodes.get(parseInt(message.from));
        let hasUser = ("user" in node);

        let longName = XSSEncode(`!${channel.toString(16)}`);
        let shortName = "UNK";

        if (hasUser) {
            longName = XSSEncode(node.user.longName);
            shortName = XSSEncode(node.user.shortName);
        }

        let content = XSSEncode(message.data);
        let time = new Date(message.rxTime).toLocaleTimeString('en-AU'); // TODO: Get locale setting

        let template = document.createElement("template");
        template.innerHTML = `
        <mdui-list-item alignment="start" active rounded style='padding: 5px; margin: 10px; margin-top: 20px;'>
            <div style="white-space: pre-wrap; text-align: left;">${content}</div>
            <span slot="description">Sent at ${time} by <span style="white-space: nowrap">${longName} <mdui-badge style="vertical-align: middle;">${shortName}</mdui-badge></span></span>
            <mdui-avatar slot="icon">${longName.charAt(0)}</mdui-avatar>
        </mdui-list-item>
        `;

        messageList.appendChild(template.content.cloneNode(true));
    });
}

export function init() {
    let params = new URLSearchParams(`?${window.location.hash.split("?")[1]}`)
    let messageBox = document.getElementById("message.message-box");
    let sendButton = document.getElementById("message.send-button");

    let channelId = parseInt(params.get("channel"));
    let channelName = "UNK";

    if (channelId < 10) {
        // Get channel name

        let channel = globalDevice.channels.get(channelId);
        let name = channel.settings.name;

        channelName = (name.length > 0) ? name : "Public";
        setBackButtonURL("#channels");
    } else {
        // Get node name
        let node = globalDevice.nodes.get(channelId);
        console.log(globalDevice);
        console.log(node);

        channelName = XSSEncode(`!${channelId.toString(16)}`);
        
        if ("user" in node) channelName = node.user.longName;
        setBackButtonURL("#nodes");
    }

    // Set titles
    setTitle(`Message ${channelName}`);
    messageBox.setAttribute("label", `Message ${channelName}`);

    // Send button
    sendButton.addEventListener("click", (event) => {
        if (messageBox.value.length == 0) return;

        let dest = channelId;
        let channel = 0;
        if (channelId < 10) {
            dest = "broadcast";
            channel = channelId;
        }

        globalDevice.sendMessage(dest, messageBox.value, channel);
        messageBox.value = "";
    });

    globalDevice.events.addEventListener("onMessage", () => refresh());

    loadMessages(channelId);
}

export function refresh() {
    let params = new URLSearchParams(`?${window.location.hash.split("?")[1]}`)
    let channelId = parseInt(params.get("channel"));

    loadMessages(channelId);
}

registerScript("message", init, refresh);
