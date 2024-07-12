export function getNodeInfo(node) {
    let nodeInfo = {};

    if ("user" in node) {
        nodeInfo.longName = node.user.longName;
        nodeInfo.shortName = node.user.shortName;
    } else {
        nodeInfo.longName = `!${id.toString(16)}`;
        nodeInfo.shortName = "UNK";
    }

    return nodeInfo;
}
