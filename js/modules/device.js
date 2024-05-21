import * as subscribe from "./subscribe.js";

export class Device {
    constructor(id) {
        this.id = id;

        this.client = new Meshtastic.Client();
        this.connection;

        this.myNodeNumb = 0;
        this.nodes = {};
        this.channels = {};

        this.messages = {};
    }

    async connectHttp(address, fetchInterval=3000, receiveBatchRequests=false, tls=false) {
        this.connection = this.client.createHttpConnection(0);

        await this.connection.connect({
            address: address,
            fetchInterval: fetchInterval,
            receiveBatchRequests: receiveBatchRequests,
            tls: tls
        });

        subscribe.toAll(this);
    }

    sendMessage(destination, message) {
        this.connection.sendText(message, destination);
    }
}
