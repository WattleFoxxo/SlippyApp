import { Setting } from "../settings.js";

export class AboutSetting extends Setting {
    constructor() {
        super("other.about", null);
    }

    click() {
        mdui.dialog({
            headline: "About Slippy",
            body: `
                <p>(Hopefully) A user-friendly Meshtastic compatable application.</p>

                <b style="font-size: 20px;">Links</b><br><br>

                <a href="https://github.com/WattleFoxxo/SlippyApp/">Github</a><br>
                <a href="https://slippy.wattlefoxxo.au/">Website</a><br>

                <br>
                <b style="font-size: 20px;">Credits</b>
                <p style="white-space: pre;">WattleFoxxo
LeoCatsune
woobie3
lockness-Ko</p>
            <a>Made by the Canberra Meshtastic Community.</a>
        </div>
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
