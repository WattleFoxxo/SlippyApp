import { clamp, scale, XSSEncode } from "../utils.js";
import { registerScript, setTitle } from "../router.js";

import { currentDevice } from "../../index.js";
import { refreshPage } from "../../index.js";

function loadMessages(params) {
    let userId = params.get("channel");
    if (!(userId in currentDevice.messages)) return; 

    document.getElementById("messageList").innerHTML = "";

    currentDevice.messages[params.get("channel")].forEach(message => {
        console.log("Message: ", message);

        let node = currentDevice.nodes[message.from];

        let hasUser = ("user" in node);

        let longName = `!${userId.toString(16)}`;
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

        document.getElementById("messageList").appendChild(template.content.cloneNode(true));
    });
}

export function init() {
    console.log(currentDevice);
    
    var params = new URLSearchParams(`?${window.location.hash.split("?")[1]}`)
    var messageBox = document.getElementById("messageBox");
    var sendButton = document.getElementById("sendButton");

    let userId = params.get("channel");

    let node = currentDevice.nodes[userId];
    let hasUser = ("user" in node);
    let longName = `!${userId.toString(16)}`;

    if (hasUser) {
        longName = XSSEncode(node.user.longName);
    }

    setTitle(`Message ${longName}`);
    messageBox.setAttribute("label", `Message ${longName}`);

    sendButton.addEventListener("click", (event) => {
        if (messageBox.value.length == 0) return;

        if (!(userId in currentDevice.messages)) currentDevice.messages[userId] = [];
        currentDevice.messages[userId].push({
            channel: 0,
            data: messageBox.value,
            from: parseInt(currentDevice.myNodeNum),
            to: parseInt(userId),
            id: 0,
            rxTime: new Date(),
            type: "direct"
        });

        currentDevice.sendMessage(parseInt(userId), messageBox.value);
        messageBox.value = "";
        refreshPage();
    });

    console.log(currentDevice.messages);

    loadMessages(params);
}

export function refresh() {
    var params = new URLSearchParams(`?${window.location.hash.split("?")[1]}`)
    loadMessages(params);
}

registerScript("message", init, refresh);