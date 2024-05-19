import { Device } from "./modules/device.js";
import "./modules/ui/index.js";

export const currentDevice = new Device(0);

// const meshtastic = require("Meshtastic");
// const subscription_manager = require("SubscriptionManager");

// console.log(subscription_manager);

// subscription_manager.test();
// const devices = 


// const connection = client.createHttpConnection(0);

// const devices = [ new Device(0) ]

// async function connectToHttp() {
//     await connection.connect({
//         address: "192.168.0.58",
//         fetchInterval: 3000
//     });

//     subscribeToAll();
// }