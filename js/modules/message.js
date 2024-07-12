import { MessageStatusEnum } from "./utils/types.js";
import { getNodeInfo } from "./utils/user.js";

export class MessageManager {
    constructor(device) {
        this.device = device;

        this.device.events.addEventListener("onMesh", (packet) => this._manageAck(packet));
        this.device.events.addEventListener("onTrace", (packet) => this._manageTrace(packet));
    }

    sendMessage(text, destination="broadcast", channel=0) {
        this.device.connection.sendText(text, destination, true, channel);
    }

    traceRoute(id) {
        this.device.connection.traceRoute(id);
    }

    _buildMessage(text, destination, channel, id) {
        let isDirect = (destination != "broadcast");

        let dest = (isDirect ? destination : 4294967295);
        let type = (isDirect ? "direct" : "broadcast");

        return {
            channel: channel,
            data: text,
            from: parseInt(this.device.myNodeNum),
            to: dest,
            id: id,
            rxTime: new Date(),
            type: type,
        };
    }

    _manageTrace(packet) {
        console.log(packet);
        // {
        //     "id": 1850873682,
        //     "rxTime": "2024-07-06T07:51:45.000Z",
        //     "type": "direct",
        //     "from": 1003466463,
        //     "to": 4241485080,
        //     "channel": 0,
        //     "data": {
        //         "route": [
        //             530597640,
        //             2763164227
        //         ]
        //     }
        // }

        let routeString = "Traceroute: You > ";

        packet.data.route.forEach((id) => {
            let info = getNodeInfo(this.device.nodes.get(id));
            routeString += `${info.longName} (${info.shortName}) > `;
        });

        let destInfo = getNodeInfo(this.device.nodes.get(packet.from));
        routeString += `${destInfo.longName} (${destInfo.shortName})`

        mdui.snackbar({
            message: routeString,
            action: "Ok",
        });
    }

    _manageAck(packet) {
        let decoded = packet.payloadVariant.value;

        // Routing packets only
        if (decoded.portnum != Meshtastic.Protobuf.Portnums.PortNum.ROUTING_APP) return;

        let path = this._getMessageByID(decoded.requestId);
        console.log("path:", path);

        if (!path) {
            console.error("Failed to process ack for message:", decoded.requestId, "(message not found)");
            return;
        }

        let messages = this.device.messages.get(path.channel);
        let message = messages[path.index];

        let isImplicit = (message.to != packet.from);
        message.status = isImplicit ? MessageStatusEnum.Sent : MessageStatusEnum.Recived;

        messages[path.index] = message;
        this.device.messages.set(path.channel, messages);

        this.device.events.dispatchEvent("onMessageStatus", message);
    }
    
    _getMessageByID(id) {
        let path = null;

        this.device.messages.forEach((value, key) => {
            let index = value.findIndex(obj => obj.id === id);

            if (index !== -1) {
                path = {
                    channel: key,
                    index: index,
                };
            }
        });

        return path;
    }
}
