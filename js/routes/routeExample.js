import { Route } from "../modules/route.js";

export class ExampleRoute extends Route {
    constructor() {
        super("example", "example.html");
    }

    init() {
        console.info("init in ExampleRoute");
    }

    refresh() {
        console.info("refresh in ExampleRoute");
    }
}
