import { clamp, scale, XSSEncode } from "../utils.js";
import { registerScript, setTitle } from "../router.js";
import { Logging } from "../definitions.js";

import { currentDevice } from "../../index.js";
import { refreshPage } from "../../index.js";

function loadMessages(channelId) {
    console.log(Logging.debug, currentDevice.messages);

    if (!(channelId in currentDevice.messages)) {
        console.log(Logging.warn, "No messages in channel: ", channelId);
        return false;
    }

    let messages = currentDevice.messages[channelId];

    let messageList = document.getElementById("message.message-list");
    messageList.innerHTML = "";

    messages.forEach(message => {
        console.log(Logging.debug, "Found message: ", message);

        let node = currentDevice.nodes[message.from];
        let hasUser = ("user" in node);

        let longName = XSSEncode(`!${channelId.toString(16)}`);
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
    var params = new URLSearchParams(`?${window.location.hash.split("?")[1]}`)
    var messageBox = document.getElementById("message.message-box");
    var sendButton = document.getElementById("message.send-button");

    let channelId = parseInt(params.get("channel"));
    let node = currentDevice.nodes[channelId];

    let hasUser = ("user" in node);
    let longName = XSSEncode(`!${channelId.toString(16)}`);

    if (hasUser) longName = XSSEncode(node.user.longName);

    setTitle(`Message ${longName}`);
    messageBox.setAttribute("label", `Message ${longName}`);

    // Send button
    sendButton.addEventListener("click", (event) => {
        if (messageBox.value.length == 0) return;

        currentDevice.sendMessage(channelId, messageBox.value);
        messageBox.value = "";
        
        refreshPage();
    });

    loadMessages(channelId);
}

export function refresh() {
    var params = new URLSearchParams(`?${window.location.hash.split("?")[1]}`)
    let channelId = parseInt(params.get("channel"));

    loadMessages(channelId);
}

registerScript("message", init, refresh);
