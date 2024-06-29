import { MeshDevice } from "./modules/device.js";
import { MessageManager } from "./modules/message.js";
import { Router } from "./modules/router.js";
import { NotificationManager } from "./modules/notifications.js"

import { NodesRoute } from "./routes/nodes.js";
import { ChannelsRoute } from "./routes/channels.js";
import { MessageRoute } from "./routes/message.js";
import { MapsRoute } from "./routes/maps.js";

let meshDevice = new MeshDevice();
let messageManager = new MessageManager(meshDevice);
let pageRouter = new Router();
let notificationManager = new NotificationManager(meshDevice);

pageRouter.registerRoute(new NodesRoute(meshDevice));
pageRouter.registerRoute(new ChannelsRoute(meshDevice));
pageRouter.registerRoute(new MapsRoute(meshDevice, pageRouter));
pageRouter.registerRoute(new MessageRoute(meshDevice, pageRouter, messageManager));

meshDevice.connectHttp("192.168.0.58");

document.getElementById("index.quick-menu.refresh").addEventListener("click", () => pageRouter.refreshPage());

document.getElementById("index.quick-menu.send1").addEventListener("click", () => {
    notificationManager.requestPermission();
});

document.getElementById("index.quick-menu.send2").addEventListener("click", () => {
    let notificationData = {
        title: `John Doe (UNK) • #Public`,
        options: {
            body: "Hello World!",
        },
    }

    navigator.serviceWorker.getRegistration().then((registration) => {
        let serviceWorker = registration.active || registration.waiting || registration.installing;
        
        serviceWorker.postMessage({
            type: "notification",
            data: notificationData,
        })
    });
});

pageRouter.navigateTo("nodes");

mdui.alert({
    headline: "Development",
    description: "The dev deployment is currently not functional! please use the main deployment.",
});

if ("serviceWorker" in navigator) {
    await navigator.serviceWorker.register("service-worker.js", {
        type: "module",
    });
}
