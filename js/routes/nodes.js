import { Route } from "../modules/route.js";
import { XSSEncode } from "../modules/utils/xss.js";
import { clamp, scale } from "../modules/utils/math.js";

export class NodesRoute extends Route {
    constructor(device) {
        super("nodes", "nodes.html");

        this.device = device;
    }

    init() {
        this.device.events.addEventListener("onNode", () => this.refresh());
        this.refresh();
    }

    refresh() {
        this.displayNodes();
    }

    displayNodes() {
        let nodeList = document.getElementById("nodes.node-list");
        nodeList.innerHTML = "";
    
        if (!this.device.nodes.size) {
            if (this.device.status == Meshtastic.Types.DeviceStatusEnum.DeviceDisconnected) {
                nodeList.innerHTML = '<div class="empty-list">No nodes are here yet,<br>Try connecting to a device.</div>';
                return false;
            }

            nodeList.innerHTML = '<div class="empty-list">No nodes are here yet.</div>';
            return false;
        }

        let nodes = this.sortNodes(this.device.nodes);
        nodes.forEach((node, id) => {
            let nodeInfo = this.getNodeInfo(node, id);

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
            templateLongName.innerText = nodeInfo.longName;
            templateShortName.innerText = nodeInfo.shortName;
            templateBattery.innerText = this.hasMetricsInfo(node) ? `${nodeInfo.batteryLevel}%` : "";
            templateTimestamp.innerText = nodeInfo.lastHeard;
            templatePosition.innerText = this.hasLocationInfo(node) ? `${nodeInfo.latitude.toFixed(5)}, ${nodeInfo.longitude.toFixed(5)}` : "";
            templatePosition.href = this.hasLocationInfo(node) ? `#maps?latitude=${nodeInfo.latitude}&longitude=${nodeInfo.longitude}` : "";
            
            let batteryIcons = ["battery_0_bar", "battery_1_bar", "battery_2_bar", "battery_3_bar", "battery_4_bar", "battery_5_bar", "battery_6_bar", "battery_full"];
            let batteryIcon = batteryIcons[Math.round(scale(nodeInfo.batteryLevel, 0, 100, 0, 7))];
            
            templateBatteryIcon.name = this.hasMetricsInfo(node) ? batteryIcon : "battery_unknown";
            templatePositionIcon.name = this.hasLocationInfo(node) ? "location_on" : "location_off";
            
            nodeList.appendChild(newItem);
        });
    }

    sortNodes(nodes) {
        let nodesArray = Array.from(nodes, ([key, value]) => ({ key, value }));

        nodesArray.sort((a, b) => b.value.lastHeard - a.value.lastHeard);

        return new Map(nodesArray.map(obj => [obj.key, obj.value]));
    }

    getNodeInfo(node, id) {
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
