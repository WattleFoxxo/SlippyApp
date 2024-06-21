import { clamp, scale, XSSEncode } from "../utils.js";
import { registerScript } from "../router.js";

import { currentDevice } from "../../index.js";

let map;

let markers = [];

/**
 * @param {import('../device.js').Device} device 
 */
function loadNodes(device, map) {

    markers.forEach((marker) => {
        marker.remove();
    });

    Object.entries(device.nodes).forEach(([userId, node]) => {
        try {
            let hasLocation = ("position" in node);
            let hasUser = ("user" in node);
            let hasDeviceMetrics = ("deviceMetrics" in node);

            if (hasLocation) {
                let latitude = (parseInt(node.position.latitudeI) * 0.0000001);
                let longitude = (parseInt(node.position.longitudeI) * 0.0000001);

                let longName = `!${userId.toString(16)}`;
                let shortName = "UNK";

                if (hasUser) {
                    longName = XSSEncode(node.user.longName);
                    shortName = XSSEncode(node.user.shortName);
                }

                let batteryString = "";
                let batteryIcon = "battery_unknown";

            if (hasDeviceMetrics) {
                let batteryIcons = ["battery_0_bar", "battery_1_bar", "battery_2_bar", "battery_3_bar", "battery_4_bar", "battery_5_bar", "battery_6_bar", "battery_full"];
                
                let batteryLevel = XSSEncode(clamp(node.deviceMetrics.batteryLevel, 0, 100));
                
                batteryString = `${batteryLevel}%`;
                batteryIcon = batteryIcons[Math.round(scale(batteryLevel, 0, 100, 0, 7))];
            }

                let marker = L.marker([latitude, longitude]).addTo(map);
                marker.bindPopup(`<span>${longName}&nbsp;<mdui-badge>${shortName}</mdui-badge><mdui-badge>${batteryString}</mdui-badge></span>`);
                markers.push(marker);
            }
        } catch {

        }
    });
}

export function init() {
    map = L.map('map').fitWorld();

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    loadNodes(currentDevice, map);
}

export function refresh() {
    loadNodes(currentDevice, map);
}

registerScript("maps", init, refresh);
