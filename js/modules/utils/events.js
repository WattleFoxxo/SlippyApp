export class CustomEvents {
    constructor() {
        this.events = {};
    }

    addEventListener(event, listener) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(listener);
    }

    removeEventListener(event, listener) {
        if (!this.events[event]) return;
        this.events[event] = this.events[event].filter(existingListener => existingListener !== listener);
    }

    dispatchEvent(event, ...args) {
        if (!this.events[event]) return;
        this.events[event].forEach(listener => {
            listener(...args);
        });
    }
}
