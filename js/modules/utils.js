export let XSSEncode = (str) => {
    return str.toString().replace(/[\u00A0-\u9999<>\&]/g, function(i) {
        return '&#' + i.charCodeAt(0) + ';';
    });
}

export const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

export const scale = (number, inMin, inMax, outMin, outMax) => ((number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin);

export const Logging = {
    debug: "[DEBUG]",
    notice: "[NOTICE]",
    info: "[INFO]",
    warn: "[WARN]",
    error: "[ERROR]",
    crit: "[CRIT]",
    alert: "[ALERT]",
    emerg: "[EMERG]"
};

export class AppEvents {
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

export class AppStorage {
    constructor(name) {
        this.name = name;
        this.onSetItem = new AppEvents();
        this.onGetItem = new AppEvents();
        this.onRemoveItem = new AppEvents();
    }

    setItem(key, value) {
        localStorage.setItem(`${this.name}.${key}`, value);
        this.onSetItem.dispatchEvent(key, value);
    }

    getItem(key) {
        let value = localStorage.getItem(`${this.name}.${key}`);
        this.onGetItem.dispatchEvent(key, value);

        return value;
    }

    removeItem(key) {
        localStorage.removeItem(`${this.name}.${key}`);
        this.onRemoveItem.dispatchEvent(key);
    }
}