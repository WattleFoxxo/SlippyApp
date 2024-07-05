import { Route } from "../modules/route.js";
import { XSSEncode } from "../modules/utils/xss.js";
import { clamp, scale } from "../modules/utils/math.js";

export class MapsRoute extends Route {
    constructor(device, router) {
        super("maps", "maps.html");

        this.device = device;
        this.router = router;
        this.markers = [];
        this.map;
    }

    init() {
        let parameters = this.router.getParameters();
        console.log(parameters);

        this.map = L.map('maps.map').setView([0, 0], 4);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(this.map);

        if ("latitude" in parameters && "longitude" in parameters) {
            let latitude = parseFloat(parameters.latitude);
            let longitude = parseFloat(parameters.longitude);

            this.map.setView([latitude, longitude], 16);
        } else {
            this.map.locate({setView: true, maxZoom: 10});
        }

        this.device.events.addEventListener("onNode", () => this.refresh());
        this.refresh();
    }

    refresh() {
        this.displayNodes(this.map);
    }

    displayNodes(map) {
        this.markers.forEach((marker) => {
            marker.remove();
        });
    
        if (!this.device.nodes.size) return;

        this.device.nodes.forEach((node, id) => {
            if (!this.hasLocationInfo(node)) return;
    
            let nodeInfo = this.getNodeInfo(node, id);

            let template = document.getElementById("maps.node.template");
            let newItem = template.content.cloneNode(true);
    
            let templateLongName = newItem.getElementById("_template.long-name");
            let templateShortName = newItem.getElementById("_template.short-name");
            let templateBattery = newItem.getElementById("_template.battery");
            let templateBatteryIcon = newItem.getElementById("_template.battery.icon");
            let templateTimestamp = newItem.getElementById("_template.timestamp");
            let templatePosition = newItem.getElementById("_template.position");
    
            templateLongName.innerText = nodeInfo.longName;
            templateShortName.innerText = nodeInfo.shortName;
            templateBattery.innerText = this.hasMetricsInfo(node) ? `${nodeInfo.batteryLevel}%` : "";
            templateTimestamp.innerText = moment(nodeInfo.lastHeard).fromNow();
            templatePosition.innerText = `${nodeInfo.latitude.toFixed(5)}, ${nodeInfo.longitude.toFixed(5)}`;
            
            let batteryIcons = ["battery_0_bar", "battery_1_bar", "battery_2_bar", "battery_3_bar", "battery_4_bar", "battery_5_bar", "battery_6_bar", "battery_full"];
            let batteryIcon = batteryIcons[Math.round(scale(nodeInfo.batteryLevel, 0, 100, 0, 7))];
    
            templateBatteryIcon.innerText = this.hasMetricsInfo(node) ? batteryIcon : "battery_unknown";
    
            let element = document.createElement("div");
            element.appendChild(newItem);
                
            let hash = CryptoJS.MD5(`!${id.toString(16)}`).toString(CryptoJS.enc.Hex);
            let options = {
                background: [240, 240, 240, 255],
                size: 32,
                format: 'png'
            };
        
            let icon = new Identicon(hash, options).toString();
        
            let nodeIcon = L.divIcon({
                className: "node-marker",
                html: `<mdui-avatar src="data:image/png;base64,${icon}"></mdui-avatar>`,
                iconSize: [40, 40],
                iconAnchor: [20, 20],
                popupAnchor: [0, -20],
            });
    
            let marker = L.marker([nodeInfo.latitude, nodeInfo.longitude], {icon: nodeIcon}).addTo(map);
            marker.bindPopup(element.innerHTML);

            this.markers.push(marker);
        });
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

        nodeInfo.lastHeard = new Date(node.lastHeard * 1000);

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
