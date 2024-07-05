import { Setting } from "../settings.js";

export class AboutSetting extends Setting {
    constructor() {
        super("other.about", null);
    }

    click() {
        mdui.dialog({
            headline: "About Slippy",
            body: `
                <p>(Hopefully) A user-friendly Meshtastic compatable application created by: Wattlefox, Woobie, Leo-Catto and lockness Ko.</p>
                <p>Made for and by the Canberra Meshtastic Community.</p>
            `,
            actions: [
                {
                    text: "Ok",
                },
            ],
        });
    }
}

export class DebugSetting extends Setting {
    constructor() {
        super("other.debug", null);
    }
}
