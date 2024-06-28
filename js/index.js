import { MeshDevice } from "./modules/device.js";
import { MessageManager } from "./modules/message.js";
import { Router } from "./modules/router.js";

import { NodesRoute } from "./routes/nodes.js";
import { ChannelsRoute } from "./routes/channels.js";
import { MessageRoute } from "./routes/message.js";

let meshDevice = new MeshDevice();
let messageManager = new MessageManager(meshDevice);
let pageRouter = new Router();

pageRouter.registerRoute(new NodesRoute(meshDevice));
pageRouter.registerRoute(new ChannelsRoute(meshDevice));
pageRouter.registerRoute(new MessageRoute(meshDevice, pageRouter, messageManager));

meshDevice.connectHttp("192.168.0.58");

document.getElementById("index.quick-menu.refresh").addEventListener("click", () => pageRouter.refreshPage());
document.getElementById("index.quick-menu.send1").addEventListener("click", () => messageManager.sendMessage("Hello World!", "broadcast", 1));
document.getElementById("index.quick-menu.send2").addEventListener("click", () => messageManager.sendMessage("Hello World!", 3175757200, 0));

pageRouter.navigateTo("nodes");

if ("serviceWorker" in navigator) {
    await navigator.serviceWorker.register("service-worker.js", {
        type: "module",
    });
}
