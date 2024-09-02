import { CustomEvents } from "./events.js";

export class AppStorage {
    constructor(name) {
        this.name = name;
        this.events = new CustomEvents();
    }

    setItem(key, value) {
        localStorage.setItem(`${this.name}.${key}`, value);
        this.events.dispatchEvent(`${key}.onSet`, value);
    }

    getItem(key) {
        let value = localStorage.getItem(`${this.name}.${key}`);

        this.events.dispatchEvent(`${key}.onGet`, value);
        return value;
    }

    hasItem(key) {
        return localStorage.hasOwnProperty(`${this.name}.${key}`);
    }

    removeItem(key) {
        localStorage.removeItem(`${this.name}.${key}`);
        this.events.dispatchEvent(`${key}.onRemove`);
    }
}
