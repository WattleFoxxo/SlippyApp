import * as subscribe from "./subscribe.js";

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
        this.connection.sendText(message, destination);
    }
}
