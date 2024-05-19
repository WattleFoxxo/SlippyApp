const meshtastic = globalThis.Meshtastic.meshtastic;
            
const client = new meshtastic.Client();
const connection = client.createHttpConnection(0);

const myDevice = new Device(0);

async function connectToHttp() {
    await connection.connect({
        address: "192.168.0.58",
        fetchInterval: 3000
    });

    subscribeToAll();
}