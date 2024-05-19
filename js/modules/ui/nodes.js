import {clamp, scale, XSSEncode} from "../utils.js";

export function loadNodes(device) {
    document.getElementById("nodes/nodelist").innerHTML = "";

    Object.entries(device.nodes).forEach(([id, node]) => {

        try {
            let hasUser = ("user" in node);
            let hasLocation = ("position" in node);
            let hasDeviceMetrics = ("deviceMetrics" in node);

            let longName = `!${id.toString(16)}`;
            let shortName = "UNK";

            if (hasUser) {
                longName = XSSEncode(node.user.longName);
                shortName = XSSEncode(node.user.shortName);
            }

            let locationString = "";
            let locationIcon = "location_off";

            if (hasLocation) {
                let latitude = XSSEncode((node.position.latitudeI / 10000000));
                let longitude = XSSEncode((node.position.longitudeI / 10000000));

                locationString = ` <a href=\"\">${latitude} ${longitude}</a>`;
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
            
            // TODO: Prevent XSS
            let template = document.createElement("template");
            template.innerHTML = `
            <mdui-list-item icon="people" end-icon="arrow_right" fab-detach>
                ${longName} <mdui-badge style="vertical-align: middle;">${shortName}</mdui-badge>
                <span slot="description">
                    <span style="white-space: nowrap"><i class="material-icons nodes-nodelistitemdescription">${batteryIcon}</i>${batteryString}</span>
                    &nbsp;
                    <span style="white-space: nowrap"><i class="material-icons nodes-nodelistitemdescription">schedule</i> UNK</span>
                    &nbsp;
                    <span style="white-space: nowrap"><i class="material-icons nodes-nodelistitemdescription">${locationIcon}</i>${locationString}</span>
                </span>
            </mdui-list-item>
            `;
    
            document.getElementById("nodes/nodelist").appendChild(template.content.cloneNode(true))
        } catch (e) {
            console.log("Faild to parse node: ", e);
        }
    });
}