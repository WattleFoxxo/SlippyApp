const routes = {
    "nodes": "nodes.html",
    "channels": "channels.html",
    "maps": "maps.html",
    "message": "message.html",
};

const scripts = {};

export function registerScript(route, init) {
    scripts[route] = init;
}

function manageUi() {
    let navbar = document.getElementById("navbar");
    let backButton = document.getElementById("topbar/backButton");
    let title = document.getElementById("topbar/title");

    let pageSettings = document.getElementById("pageSettings");

    navbar.style = ((pageSettings.getAttribute("hasNavbar") === "true") ? "" : "display: none;");
    backButton.style = ((pageSettings.getAttribute("hasBackButton") === "true") ? "" : "display: none;");

    backButton.href = pageSettings.getAttribute("backButtonURL");
    title.innerText = pageSettings.getAttribute("pageTitle");
}

async function fetchContent(filePath) {
    try {
        let response = await fetch(`routes/${filePath}`);
        if (!response.ok) {
            throw new Error("Failed to fetch HTML content");
        }
        let html = await response.text();

        return html;
    } catch (error) {
        console.error(error);
        return '<h2>Error: Failed to fetch HTML content</h2>';
    }
}

export async function navigateTo(route) {
    let filePath = routes[route];
    if (!filePath) {
        return navigateTo("nodes");
    }

    let content = await fetchContent(filePath);
    let container = document.getElementById("content");

    container.innerHTML = content;

    manageUi();

    console.log("Loading:", route);
    console.log("in scripts:", scripts);

    if (route in scripts) scripts[route]();
}

window.addEventListener("hashchange", (event) => {
    let route = window.location.hash.slice(1).split("?")[0];
    navigateTo(route);
});
