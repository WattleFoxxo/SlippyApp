
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
const scale = (number, inMin, inMax, outMin, outMax) => ((number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin);

export function loadNodes(device) {
    document.getElementById("nodes/nodelist").innerHTML = "";

    Object.entries(device.nodes).forEach(([id, node]) => {

        try {
            var hasUser = ("user" in node);
            var hasLocation = ("position" in node);
            var hasDeviceMetrics = ("deviceMetrics" in node);

            var longName = `!${id.toString(16)}`;
            var shortName = "UNK";

            if (hasUser) {
                longName = node.user.longName;
                shortName = node.user.shortName;
            }

            var locationString = "";
            var locationIcon = "location_off";

            if (hasLocation) {
                var latitude = (node.position.latitudeI / 10000000);
                var longitude = (node.position.longitudeI / 10000000);

                locationString = ` <a href=\"\">${latitude} ${longitude}</a>`;
                locationIcon = ("location_on");
            }
            
            var batteryString = "";
            var batteryIcon = "battery_unknown";

            if (hasDeviceMetrics) {
                var batteryIcons = ["battery_0_bar", "battery_1_bar", "battery_2_bar", "battery_3_bar", "battery_4_bar", "battery_5_bar", "battery_6_bar", "battery_full"];
                
                var batteryLevel = clamp(node.deviceMetrics.batteryLevel, 0, 100);
                
                batteryString = `${batteryLevel}%`;
                batteryIcon = batteryIcons[Math.round(scale(batteryLevel, 0, 100, 0, 7))];
            }
            
            // TODO: Prevent XSS
            var template = document.createElement("template");
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