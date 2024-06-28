
class NotificationManager {
    constructor(device) {
        this.device = device;
        this.device.events.addEventListner("onMessage", (message) => this._handelNotification(message));
    }

    _handelNotification(message) {
        console.log("_handelNotification");
        navigator.serviceWorker.getRegistration().then((reg) => {
            reg.showNotification(message.data);
        });
    }
}
