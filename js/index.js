const mdui = globalThis.mdui;

// TODO: Move
function scale(number, inMin, inMax, outMin, outMax) {
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

function clamp(num, lower, upper) {
    return Math.min(Math.max(num, lower), upper);
}

function populateNodeList() {
    myDevice.nodes.forEach((node) => {
        try {
            var longName = node.user.longName;
            var shortName = node.user.shortName;
            
            var latitude;
            var longitude;
            var locationEnabled = (node.position !== undefined);

            if (locationEnabled) {
                latitude = (node.position.latitudeI / 10000000).toFixed(3);
                longitude = (node.position.longitudeI / 10000000).toFixed(3);
            }
            
            var batteryLevel;
            var batteryIcon;
            var hasDeviceMetrics = (node.deviceMetrics !== undefined);

            if (hasDeviceMetrics) {
                var batteryIcons = ["battery_0_bar", "battery_1_bar", "battery_2_bar", "battery_3_bar", "battery_4_bar", "battery_5_bar", "battery_6_bar", "battery_full"];
                batteryLevel = clamp(node.deviceMetrics.batteryLevel, 0, 100);
                batteryIcon = batteryIcons[Math.round(scale(batteryLevel, 0, 100, 0, 7))];
            }


            
            // TODO: Prevent XSS
            var template = document.createElement("template");
            template.innerHTML = `
            <mdui-list-item icon="people" end-icon="arrow_right" fab-detach>
                ${longName} <mdui-badge style="vertical-align: middle;">${shortName}</mdui-badge>
                <br>
                <span class="nodes-nodelistitemdescription">
                    <i class="material-icons nodes-nodelistitemdescription">${hasDeviceMetrics ? batteryIcon : "battery_unknown"}</i>${hasDeviceMetrics ? `${batteryLevel}%` : ""}
                    &nbsp;
                    <i class="material-icons nodes-nodelistitemdescription">${locationEnabled ? "location_on" : "location_off"}</i>${locationEnabled ? ` <a href=\"\">${latitude} ${latitude}</a>:` : ""}
                    &nbsp;
                    <i class="material-icons nodes-nodelistitemdescription">schedule</i> now
                </span>
            </mdui-list-item>
            `;

            document.getElementById("nodes/nodelist").appendChild(template.content.cloneNode(true))
        } catch (e) {
            console.log("Faild to parse node: ", e);
        }
    });
}