
export class NotificationManager {
    constructor(device) {
        this.device = device;
        this.device.events.addEventListener("onMessage", (message) => this._handelNotification(message));
    }

    requestPermission() {
        Notification.requestPermission();
    }

    _handelNotification(message) {
        if (message.from == this.device.myNodeNum) return;

        let isDirect = (message.to != 4294967295);

        let node = this.device.nodes.get(parseInt(message.from));
        let nodeInfo = this._getNodeInfo(node);

        let channel = this.device.channels.get(parseInt(message.channel));
        let channelInfo = this._getChannelInfo(channel);
        let channelName = isDirect ? "" : ` • #${channelInfo.name}`;

        let notificationData = {
            title: `${nodeInfo.longName} (${nodeInfo.shortName})${channelName}`,
            options: {
                body: message.data,
            },
        }

        navigator.serviceWorker.getRegistration().then((registration) => {
            let serviceWorker = registration.active || registration.waiting || registration.installing;
            
            serviceWorker.postMessage({
                type: "notification",
                data: notificationData,
            })
        });
    }

    _getNodeInfo(node) {
        let nodeInfo = {};

        if ("user" in node) {
            nodeInfo.longName = node.user.longName;
            nodeInfo.shortName = node.user.shortName;
        } else {
            nodeInfo.longName = `!${id.toString(16)}`;
            nodeInfo.shortName = "UNK";
        }

        return nodeInfo;
    }

    _getChannelInfo(channel) {
        let channelInfo = {};

        if (channel.settings.name.length <= 0) {
            channelInfo.name = "Public";
        } else if (channel.role == 0) {
            channelInfo.name = `UNK (${channel.id})`;
        } else {
            channelInfo.name = channel.settings.name;
        }

        return channelInfo;
    }
}
