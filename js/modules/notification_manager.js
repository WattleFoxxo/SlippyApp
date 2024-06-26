import { globalDevice } from "../index.js";
import { XSSEncode } from "./utils.js";

export function initNoitif() {
    globalDevice.events.addEventListener("onMessage", (message) => {
        let longName = XSSEncode(`!${message.from.toString(16)}`);
        let shortName = "UNK";
        
        let hasNode = globalDevice.nodes.has(message.from);
        if (hasNode) {
            let node = globalDevice.nodes.get(message.from);
            if ("user" in node) {
                longName = XSSEncode(node.user.longName);
                shortName = XSSEncode(node.user.shortName);
            }
        }

        let notification = new Notification(
            `${longName} (${shortName}): ${XSSEncode(message.data)}`
        );
    });
}