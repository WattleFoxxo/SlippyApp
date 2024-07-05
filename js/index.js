import { MeshDevice } from "./modules/device.js";
import { MessageManager } from "./modules/message.js";
import { Router } from "./modules/router.js";
import { NotificationManager } from "./modules/notifications.js";
import { AppStorage } from "./modules/utils/storage.js";
import { SettingsManager, Setting } from "./modules/settings.js";

import { NodesRoute } from "./routes/nodes.js";
import { ChannelsRoute } from "./routes/channels.js";
import { MessageRoute } from "./routes/message.js";
import { MapsRoute } from "./routes/maps.js";
import { SettingsRoute } from "./routes/settings.js";

import { ThemeSetting } from "./modules/settings/mduiSettings.js";
import { ColourThemeSetting } from "./modules/settings/mduiSettings.js";
import { AboutSetting, DebugSetting } from "./modules/settings/otherSettings.js";
import { RadioConnectSetting } from "./modules/settings/radioConnectSetting.js";

let meshDevice = new MeshDevice();
let messageManager = new MessageManager(meshDevice);
let pageRouter = new Router();
let notificationManager = new NotificationManager(meshDevice);
let settingsManager = new SettingsManager("settings");

meshDevice.init();

pageRouter.registerRoute(new NodesRoute(meshDevice));
pageRouter.registerRoute(new ChannelsRoute(meshDevice));
pageRouter.registerRoute(new MapsRoute(meshDevice, pageRouter));
pageRouter.registerRoute(new MessageRoute(meshDevice, pageRouter, messageManager));
pageRouter.registerRoute(new SettingsRoute(settingsManager));

settingsManager.registerSetting(new ThemeSetting());
settingsManager.registerSetting(new ColourThemeSetting());
settingsManager.registerSetting(new AboutSetting());
settingsManager.registerSetting(new DebugSetting());
settingsManager.registerSetting(new RadioConnectSetting(meshDevice, settingsManager));

// meshDevice.connectHttp("192.168.0.58");

document.getElementById("index.quick-menu.refresh").addEventListener("click", () => pageRouter.refreshPage());

settingsManager.init();
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
