import { Setting } from "../settings.js";

export class ExampleSetting extends Setting {
    constructor() {
        super("examplekey", "defualt value");
    }

    // When setting gets changed
    change(value) {
        console.log("Example setting changed", value);
    }

    // When setting ui gets clicked
    click() {
        console.log("Example setting clicked");
    }
}
