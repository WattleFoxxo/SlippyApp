import { currentDevice } from "../../index.js";
import * as nodes from "./nodes.js";

document.getElementById("topbar/connect").addEventListener("click", () => {
    currentDevice.connectHttp("192.168.0.58");
});
