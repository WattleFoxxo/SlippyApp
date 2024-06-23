import { CustomEvents, DeviceStatus } from "./modules/utils.js";

export class Device {
    constructor() {
        this.client = new Meshtastic.Client();
        this.connection;
        this.status;

        this.myNodeNum;
        this.nodes = new Map();
        this.channels = new Map();
        this.messages = new Map();

        this.events = new CustomEvents();
    }

    setStatus(status) {
        this.status = status;
        this.events.dispatchEvent("onStatus", status);
    }

    setNode(node) {
        console.log("setNode", node);

        this.nodes.set(node.num, node);
        this.events.dispatchEvent("onNode", node);
    }

    setChannel(channel) {
        console.log("setChannel", channel);

        this.channels.set(channel.index, channel);
        this.events.dispatchEvent("onChannel", channel);
    }

    setMessage(message) {
        console.log("setMessage", message);

        let channel;
        
        if (message.type == "direct") {
            channel = message.from;
        } else {
            channel = message.channel;
        }
        
        this.messages.direct.set(channel, message);
        this.events.dispatchEvent("onMessage", message);
    }

    connect() {
        this.connection = this.client.createHttpConnection(0);
        this.connection.connect({
            address: "192.168.0.58",
            fetchInterval: 300,
            receiveBatchRequests: false,
            tls: false,
        });

        this._subscribe();
        this.events.dispatchEvent("onConnect");
    }

    _subscribe() {
        this.connection.events.onMyNodeInfo.subscribe((data) => this.myNodeNum = data.myNodeNum);
    
        this.connection.events.onDeviceStatus.subscribe((data) => this.setStatus(data));
        this.connection.events.onNodeInfoPacket.subscribe((data) => this.setNode(data));
        this.connection.events.onChannelPacket.subscribe((data) => this.setChannel(data));
        this.connection.events.onMessagePacket.subscribe((data) => this.setMessage(data));
    }
}
