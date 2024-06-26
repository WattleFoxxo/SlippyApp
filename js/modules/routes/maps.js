import { clamp, scale, XSSEncode, Logging } from "../utils.js";
import { registerScript } from "../router.js";
import { globalDevice } from "../../index.js";

let map;

let markers = [];

function loadNodes(map) {
    markers.forEach((marker) => {
        marker.remove();
    });

    if (!globalDevice.nodes.size) return;

    globalDevice.nodes.forEach((node, id) => {
        let hasUser = ("user" in node);
        let hasLocation = ("position" in node);
        let hasDeviceMetrics = ("deviceMetrics" in node);

        if (!hasLocation) return;

        let latitude = parseInt(node.position.latitudeI) * 0.0000001;
        let longitude = parseInt(node.position.longitudeI) * 0.0000001;

        let longName = XSSEncode(`!${id.toString(16)}`);
        let shortName = "UNK";
        if (hasUser) {
            longName = XSSEncode(node.user.longName);
            shortName = XSSEncode(node.user.shortName);
        }

        let batteryLevel = 0;
        if (hasDeviceMetrics) {
            batteryLevel = clamp(parseInt(node.deviceMetrics.batteryLevel), 0, 100);
        }

        let lastHeard = moment(new Date(node.lastHeard * 1000)).fromNow()

        let template = document.getElementById("maps.node.template");
        let newItem = template.content.cloneNode(true);

        let templateLongName = newItem.getElementById("_template.long-name");
        let templateShortName = newItem.getElementById("_template.short-name");
        let templateBattery = newItem.getElementById("_template.battery");
        let templateBatteryIcon = newItem.getElementById("_template.battery.icon");
        let templateTimestamp = newItem.getElementById("_template.timestamp");
        let templatePosition = newItem.getElementById("_template.position");

        templateLongName.innerText = longName;
        templateShortName.innerText = shortName;
        templateBattery.innerText = hasDeviceMetrics?`${batteryLevel}%`:"";
        templateTimestamp.innerText = lastHeard;
        templatePosition.innerText = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
        
        let batteryIcons = ["battery_0_bar", "battery_1_bar", "battery_2_bar", "battery_3_bar", "battery_4_bar", "battery_5_bar", "battery_6_bar", "battery_full"];
        let batteryIcon = batteryIcons[Math.round(scale(batteryLevel, 0, 100, 0, 7))];

        templateBatteryIcon.innerText = hasDeviceMetrics?batteryIcon:"battery_unknown";

        var element = document.createElement("div");
        element.appendChild(newItem);
        
        var hash = CryptoJS.MD5(`!${id.toString(16)}`).toString(CryptoJS.enc.Hex);
        var icon = new Identicon(hash, 32).toString();

        var hash = CryptoJS.MD5(`!${id.toString(16)}`).toString(CryptoJS.enc.Hex);
        var options = {
            background: [240, 240, 240, 255],
            size: 32,
            format: 'png'
        };
    
        var icon = new Identicon(hash, options).toString();
    
        var nodeIcon = L.divIcon({
            className: "node-marker",
            html: `<mdui-avatar src="data:image/png;base64,${icon}"></mdui-avatar>`,
            iconSize:     [40, 40],
            iconAnchor:   [20, 20],
            popupAnchor:  [0, -20],
        });

        let marker = L.marker([latitude, longitude], {icon:nodeIcon}).addTo(map);
        marker.bindPopup(element.innerHTML);
        markers.push(marker);
    });
}

export function init() {
    let params = new URLSearchParams(`?${window.location.hash.split("?")[1]}`)

    map = L.map('maps.map').setView([0, 0], 4);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    if (params.has("latitude") && params.has("longitude")) {
        let latitude = parseFloat(params.get("latitude"));
        let longitude = parseFloat(params.get("longitude"));

        map.setView([latitude, longitude], 16);
    } else {
        map.locate({setView: true, maxZoom: 10});
    }

    loadNodes(map);
}

export function refresh() {
    loadNodes(map);
}

registerScript("maps", init, refresh);
