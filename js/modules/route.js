
export class Route {
    constructor(route, file) {
        this.route = route;
        this.file = file;
    }

    init() {
        console.warn("The init callback is not set in route:", this);
    }

    refresh() {
        console.warn("The refresh callback is not set in route:", this);
    }
}