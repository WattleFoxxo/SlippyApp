import { clamp, scale, XSSEncode, Logging, DeviceStatus } from "../utils.js";
import { registerScript } from "../router.js";
import { globalDevice } from "../../index.js";

function loadNodes() {
    let nodeList = document.getElementById("nodes.node-list");
    nodeList.innerHTML = "";

    if (globalDevice.status == DeviceStatus.Disconnected) {
        nodeList.innerHTML = '<div class="empty-list">No nodes are here yet,<br>Try connecting to a device.</div>';
        return false;
    }

    if (!globalDevice.nodes.size) {
        nodeList.innerHTML = '<div class="empty-list">No nodes are here yet.</div>';
        return false;
    }

    // Sort by last seen
    let nodesArray = Array.from(globalDevice.nodes, ([key, value]) => ({ key, value }));
    nodesArray.sort((a, b) => b.value.lastHeard - a.value.lastHeard);
    let sortedNodes = new Map(nodesArray.map(obj => [obj.key, obj.value]));

    sortedNodes.forEach((node, id) => {
        let hasUser = ("user" in node);
        let hasLocation = ("position" in node);
        let hasDeviceMetrics = ("deviceMetrics" in node);

        let longName = XSSEncode(`!${id.toString(16)}`);
        let shortName = "UNK";
        if (hasUser) {
            longName = XSSEncode(node.user.longName);
            shortName = XSSEncode(node.user.shortName);
        }

        let latitude = 0.00000;
        let longitude = 0.00000;
        if (hasLocation) {
            latitude = (parseInt(node.position.latitudeI) * 0.0000001).toFixed(3);
            longitude = (parseInt(node.position.longitudeI) * 0.0000001).toFixed(3);
        }

        let batteryLevel = 0;
        if (hasDeviceMetrics) {
            batteryLevel = clamp(parseInt(node.deviceMetrics.batteryLevel), 0, 100);
        }

        let lastHeard = moment(new Date(node.lastHeard * 1000)).fromNow()

        let template = document.getElementById("nodes.node-list.template");
        let newItem = template.content.cloneNode(true);

        let templateItem = newItem.getElementById("_template.item");
        let templateLongName = newItem.getElementById("_template.long-name");
        let templateShortName = newItem.getElementById("_template.short-name");
        let templateBattery = newItem.getElementById("_template.battery");
        let templateBatteryIcon = newItem.getElementById("_template.battery.icon");
        let templateTimestamp = newItem.getElementById("_template.timestamp");
        let templatePosition = newItem.getElementById("_template.position");
        let templatePositionIcon = newItem.getElementById("_template.position.icon");

        templateItem.href = `#message?channel=${id}`;
        templateLongName.innerText = longName;
        templateShortName.innerText = shortName;
        templateBattery.innerText = hasDeviceMetrics?`${batteryLevel}%`:"";
        templateTimestamp.innerText = lastHeard;
        templatePosition.innerText = hasLocation?`${latitude}, ${longitude}`:"";
        templatePosition.href = hasLocation?`#maps?latitude=${latitude}&longitude=${longitude}`:"";
        
        let batteryIcons = ["battery_0_bar", "battery_1_bar", "battery_2_bar", "battery_3_bar", "battery_4_bar", "battery_5_bar", "battery_6_bar", "battery_full"];
        let batteryIcon = batteryIcons[Math.round(scale(batteryLevel, 0, 100, 0, 7))];
        
        templateBatteryIcon.name = hasDeviceMetrics?batteryIcon:"battery_unknown";
        templatePositionIcon.name = hasLocation?"location_on":"location_off"
        
        nodeList.appendChild(newItem);
    });
}

export function init() {
    loadNodes();
    globalDevice.events.addEventListener("onNode", () => refresh());
}

export function refresh() {
    loadNodes();
}

registerScript("nodes", init, refresh);
