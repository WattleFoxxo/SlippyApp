import * as subscribe from "./subscribe.js";
import { deviceStorage } from "../index.js";

export class Device {
    constructor(id) {
        this.id = id;

        this.client = new Meshtastic.Client();
        this.connection;

        this.myNodeNum = 0;
        this.nodes = {};
        this.channels = {};
        this.nodePositions = {};

        this.messages = {};
    }

    async connectHttp(address, fetchInterval = 3000, receiveBatchRequests = false, tls = false) {
        this.connection = this.client.createHttpConnection(0);

        await this.connection.connect({
            address: address,
            fetchInterval: fetchInterval,
            receiveBatchRequests: receiveBatchRequests,
            tls: tls
        });

        subscribe.toAll(this);
    }

    async connectBluetooth() {
        this.connection = this.client.createBleConnection(0);
        
        let ble_device = await this.connection.getDevice();

        if (ble_device) {
            await this.connection.connect(ble_device);
            subscribe.toAll(this);
        }
    }

    async connectSerial() {
        this.connection = this.client.createSerialConnection(0);
        
        let port = await this.connection.getPort();

        if (port) {
            await this.connection.connect(port);
            subscribe.toAll(this);
        }
    }


    sendMessage(destination, message) {

        // Make sure we have an entry
        if (!(parseInt(destination) in this.messages)) this.messages[parseInt(destination)] = [];
        
        this.messages[parseInt(destination)].push({
            channel: 0,
            data: message,
            from: parseInt(this.myNodeNum),
            to: parseInt(destination),
            id: 0,
            rxTime: new Date(),
            type: "direct"
        });

        // THIS IS A VERY BAD IDEA! HACK!
        deviceStorage.setItem("messages", JSON.stringify(this.messages));

        this.connection.sendText(message, parseInt(destination));
    }
}
