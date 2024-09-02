import { AppStorage } from "./utils/storage.js";

export class Setting {
    constructor(key, defaultValue) {
        this.key = key;
        this.defaultValue = defaultValue;
    }

    change(value) {
        // Do nothing
    }

    click() {
        // Do nothing
    }
}

export class SettingsManager extends AppStorage {
    constructor(name) {
        super(name);
        this.settings = new Map();
    }

    init() {
        this.settings.forEach((setting, key) => {

            let value = setting.defaultValue;
            if (this.hasItem(key)) value = this.getItem(key);

            setting.change(value);
        });
    }

    registerSetting(setting) {
        this.settings.set(setting.key, setting);
        this.events.addEventListener(`${setting.key}.onSet`, (value) => setting.change(value));
    }
}
