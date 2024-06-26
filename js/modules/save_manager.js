import { settingStorage, deviceStorage, globalDevice } from "../index.js";

export function loadDevice() {
    // globalDevice.channels = JSON.parse(deviceStorage.getItem("channels"));
    // globalDevice.nodes = JSON.parse(deviceStorage.getItem("nodes"));
    // globalDevice.messages = JSON.parse(deviceStorage.getItem("messages"));
}

export function saveDevice() {
    // deviceStorage.setItem("channels", JSON.stringify(globalDevice.channels));
    // deviceStorage.setItem("nodes", JSON.stringify(globalDevice.nodes));
    // deviceStorage.setItem("messages", JSON.stringify(globalDevice.messages));
}

export function initSave() {
    // globalDevice.events.addEventListener("onStatus", () => saveDevice());
    // globalDevice.events.addEventListener("onMessage", () => saveDevice());
}