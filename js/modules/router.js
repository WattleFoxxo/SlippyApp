import { Logging } from "./definitions.js";

const routes = {
    "nodes": "nodes.html",
    "channels": "channels.html",
    "maps": "maps.html",
    "message": "message.html",
    "settings":"settings.html",
    "settings/appearance": "settings/appearance.html",
};

let scripts = {};
let currentRoute = "";

export function registerScript(route, init, refresh) {
    scripts[route] = {
        "init": init,
        "refresh": refresh
    };
}

function updateUI() {
    let title = document.getElementById("index/titlebar/title");
    let navbar = document.getElementById("index/navbar");
    let backButton = document.getElementById("index/titlebar/back-button");
    let pageSettings = document.getElementById("index/page-settings");

    let hasNavbar = pageSettings.hasAttribute("has-navbar");
    let hasBackButton = pageSettings.hasAttribute("has-back-button");

    if (!hasNavbar) navbar.style = "display: none;";
    if (!hasBackButton) backButton.style = "display: none;";

    backButton.href = pageSettings.getAttribute("back-button-url");
    title.innerText = pageSettings.getAttribute("page-title");
}

async function fetchContent(filePath) {
    let response = await fetch(`./routes/${filePath}`);

    if (!response.ok) {
        console.log(Logging.error, "Failed to fetch HTML content");
        return "<h2>Failed to fetch HTML content, try restarting or reinstalling slippy.</h2>";
    }

    return await response.text();
}

export function setTitle(title) {
    document.getElementById("index/titlebar/title").innerText = title;
}

export function refresh() {
    if (currentRoute in scripts) scripts[currentRoute].refresh();
}

export async function navigateTo(route) {
    console.log(Logging.info, "loading route:", route);

    let filePath = routes[route];
    if (!filePath) {
        return navigateTo("nodes");
    }

    let content = await fetchContent(filePath);
    let container = document.getElementById("index/page-container");

    container.innerHTML = content;
    updateUI();

    currentRoute = route;
    if (route in scripts) scripts[route].init();
}

window.addEventListener("hashchange", (event) => {
    let route = window.location.hash.slice(1).split("?")[0];
    navigateTo(route);
});
