import { Setting } from "../settings.js";

export class ThemeSetting extends Setting {
    constructor() {
        super("appearance.theme", "auto");
    }

    change(value) {
        mdui.setTheme(value);
    }
}

export class ColourThemeSetting extends Setting {
    constructor() {
        super("appearance.colour-theme", "#673ab7");
    }

    change(value) {
        mdui.setColorScheme(value);
    }
}
