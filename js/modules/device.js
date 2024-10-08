import { CustomEvents } from "./utils/events.js";
import { MessageStatusEnum } from "./utils/types.js";
import { AppStorage } from "./utils/storage.js";

export class MeshDevice {
    constructor() {
        this.client = new Meshtastic.Client();
        this.connection;
        this.status = Meshtastic.Types.DeviceStatusEnum.DeviceDisconnected;

        this.myNodeNum;
        this.nodes = new Map();
        this.channels = new Map();
        this.messages = new Map();

        this.storage = new AppStorage("device");
        this.events = new CustomEvents();
    }

    init() {
        if (this.storage.hasItem("nodes")) {
            this.nodes = new Map(JSON.parse(this.storage.getItem("nodes")));
        }

        if (this.storage.hasItem("messages")) {
            this.messages = new Map(JSON.parse(this.storage.getItem("messages")));
        }

        if (this.storage.hasItem("channels")) {
            this.channels = new Map(JSON.parse(this.storage.getItem("channels")));
        }

        if (this.storage.hasItem("myNodeNum")) {
            this.myNodeNum = parseInt(this.storage.getItem("myNodeNum"));
        }

        this.events.addEventListener("onNode", () => {
            this.storage.setItem("nodes", JSON.stringify(Array.from(this.nodes.entries())));
        });

        this.events.addEventListener("onMessage", () => {
            this.storage.setItem("messages", JSON.stringify(Array.from(this.messages.entries())));
        });

        this.events.addEventListener("onChannel", () => {
            this.storage.setItem("channels", JSON.stringify(Array.from(this.channels.entries())));
        });

        this.events.addEventListener("onStatus", () => {
            this.storage.setItem("myNodeNum", this.myNodeNum);
        });
    }

    setStatus(status) {
        this.status = status;
        this.events.dispatchEvent("onStatus", status);
    }

    setNode(node) {
        console.log("onNode", node);

        this.nodes.set(node.num, node);
        this.events.dispatchEvent("onNode", node);
    }

    setChannel(channel) {
        console.log("onChannel", channel);

        this.channels.set(channel.index, channel);
        this.events.dispatchEvent("onChannel", channel);
    }

    setMessage(message) {
        console.log("onMessage", message);

        let isDirect = (message.type == "direct");
        let isSending = (message.from == this.myNodeNum);

        let nodeId = isSending ? message.to : message.from;
        let channel = isDirect ? nodeId : message.channel;
        let messages = [];

        if (this.messages.has(channel))
            messages = this.messages.get(channel);

        if (isSending)
            message.status = MessageStatusEnum.Sending;

        messages.push(message);

        this.messages.set(channel, messages);
        this.events.dispatchEvent("onMessage", message);
    }

    async connectHttp(address, fetchInterval = 3000, receiveBatchRequests = false, tls = false) {
        this.connection = this.client.createHttpConnection(0);

        await this.connection.connect({
            address: address,
            fetchInterval: fetchInterval,
            receiveBatchRequests: receiveBatchRequests,
            tls: tls
        });

        this._subscribe();
        this.events.dispatchEvent("onConnect");
    }

    async connectBluetooth() {
        this.connection = this.client.createBleConnection(0);
        
        let ble_device = await this.connection.getDevice();

        if (ble_device) {
            await this.connection.connect(ble_device);
            this._subscribe();
            this.events.dispatchEvent("onConnect");
        }
    }

    async connectSerial() {
        this.connection = this.client.createSerialConnection(0);
        
        let port = await this.connection.getPort();

        if (port) {
            await this.connection.connect(port);
            this._subscribe();
            this.events.dispatchEvent("onConnect");
        }
    }

    _subscribe() {
        this.connection.events.onMyNodeInfo.subscribe((data) => this.myNodeNum = parseInt(data.myNodeNum));
    
        this.connection.events.onDeviceStatus.subscribe((data) => this.setStatus(data));
        this.connection.events.onNodeInfoPacket.subscribe((data) => this.setNode(data));
        this.connection.events.onChannelPacket.subscribe((data) => this.setChannel(data));
        this.connection.events.onMessagePacket.subscribe((data) => this.setMessage(data));

        this.connection.events.onMeshPacket.subscribe((data) => this.events.dispatchEvent("onMesh", data));
        this.connection.events.onFromRadio.subscribe((data) => this.events.dispatchEvent("onRadio", data));
        this.connection.events.onTraceRoutePacket.subscribe((data) => this.events.dispatchEvent("onTrace", data));
    }
}
