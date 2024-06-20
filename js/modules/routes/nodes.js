import { clamp, scale, XSSEncode } from "../utils.js";
import { registerScript } from "../router.js";
import { Logging } from "../definitions.js";

import { currentDevice } from "../../index.js";

function loadNodes(device) {
    let nodeList = document.getElementById("nodes/node-list");
    nodeList.innerHTML = "";

    Object.entries(device.nodes).forEach(([userId, node]) => {
        try {
            let hasUser = ("user" in node);
            let hasLocation = ("position" in node);
            let hasDeviceMetrics = ("deviceMetrics" in node);

            let longName = XSSEncode(`!${userId.toString(16)}`);
            let shortName = "UNK";

            if (hasUser) {
                longName = XSSEncode(node.user.longName);
                shortName = XSSEncode(node.user.shortName);
            }

            let locationString = "";
            let locationIcon = "location_off";

            if (hasLocation) {
                let latitude = XSSEncode((parseInt(node.position.latitudeI) * 0.0000001).toFixed(5));
                let longitude = XSSEncode((parseInt(node.position.longitudeI) * 0.0000001).toFixed(5));

                locationString = ` <a href="">${latitude} ${longitude}</a>`;
                locationIcon = ("location_on");
            }

            let batteryString = "";
            let batteryIcon = "battery_unknown";

            if (hasDeviceMetrics) {
                let batteryIcons = ["battery_0_bar", "battery_1_bar", "battery_2_bar", "battery_3_bar", "battery_4_bar", "battery_5_bar", "battery_6_bar", "battery_full"];

                let batteryLevel = XSSEncode(clamp(node.deviceMetrics.batteryLevel, 0, 100));

                batteryString = `${batteryLevel}%`;
                batteryIcon = batteryIcons[Math.round(scale(batteryLevel, 0, 100, 0, 7))];
            }

            let template = document.createElement("template");
            template.innerHTML = `
            <mdui-list-item icon="person" end-icon="arrow_right" href="#message?channel=${userId}" fab-detach>
                ${longName} <mdui-badge style="vertical-align: middle;">${shortName}</mdui-badge>
                <span slot="description">
                    <span style="white-space: nowrap"><i class="material-icons node-description">${batteryIcon}</i>${batteryString}</span>
                    &nbsp;
                    <span style="white-space: nowrap"><i class="material-icons node-description">schedule</i> UNK</span>
                    &nbsp;
                    <span style="white-space: nowrap"><i class="material-icons node-description">${locationIcon}</i>${locationString}</span>
                </span>
            </mdui-list-item>
            `;

            nodeList.appendChild(template.content.cloneNode(true))
        } catch (e) {
            console.log(Logging.error, "Faild to parse node: ", e);
        }
    });
}

export function init() {
    loadNodes(currentDevice);
}

export function refresh() {
    loadNodes(currentDevice);
}

registerScript("nodes", init, refresh);
