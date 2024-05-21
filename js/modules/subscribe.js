// import * as nodes from "./ui/nodes.js";
import { refreshPage } from "../index.js";

export function toAll(device) {
    device.connection.events.onAtakForwarderPacket.subscribe((data) => {
        // console.log("onAtakForwarderPacket:", data);
    });

    device.connection.events.onAudioPacket.subscribe((data) => {
        // console.log("onAudioPacket:", data);
    });

    device.connection.events.onChannelPacket.subscribe((data) => {
        // console.log("onChannelPacket:", data);
    });

    device.connection.events.onConfigPacket.subscribe((data) => {
        // console.log("onConfigPacket:", data);
    });

    device.connection.events.onDetectionSensorPacket.subscribe((data) => {
        // console.log("onDetectionSensorPacket:", data);
    });

    device.connection.events.onDeviceDebugLog.subscribe((data) => {
        // console.log("onDeviceDebugLog:", data);
    });

    device.connection.events.onDeviceMetadataPacket.subscribe((data) => {
        // console.log("onDeviceMetadataPacket:", data);
    });

    device.connection.events.onFromRadio.subscribe((data) => {
        // console.log("onFromRadio:", data);
    });

    device.connection.events.onIpTunnelPacket.subscribe((data) => {
        // console.log("onIpTunnelPacket:", data);
    });

    device.connection.events.onLogEvent.subscribe((data) => {
        // console.log("onLogEvent:", data);
    });

    device.connection.events.onLogRecord.subscribe((data) => {
        // console.log("onLogRecord:", data);
    });

    device.connection.events.onMapReportPacket.subscribe((data) => {
        // console.log("onMapReportPacket:", data);
    });

    device.connection.events.onMeshHeartbeat.subscribe((data) => {
        // console.log("onMeshHeartbeat:", data);
    });

    device.connection.events.onMeshPacket.subscribe((data) => {
        // console.log("onMeshPacket:", data);
    });

    device.connection.events.onMessagePacket.subscribe((data) => {
        console.log("onMessagePacket:", data);

        if (!(data.from in device.messages)) device.messages[data.from] = [];

        device.messages[data.from].push(data);

        refreshPage();
    });

    device.connection.events.onModuleConfigPacket.subscribe((data) => {
        // console.log("onModuleConfigPacket:", data);
    });

    device.connection.events.onMyNodeInfo.subscribe((data) => {
        console.log("onMyNodeInfo:", data);
        device.myNodeNum = data.myNodeNum;
    });

    device.connection.events.onNeighborInfoPacket.subscribe((data) => {
        // console.log("onNeighborInfoPacket:", data);
    });

    device.connection.events.onNodeInfoPacket.subscribe((data) => {
        console.log("onNodeInfoPacket:", data);
        device.nodes[data.num] = data;
        // nodes.loadNodes(device);
        refreshPage();
    });

    device.connection.events.onPaxcounterPacket.subscribe((data) => {
        // console.log("onPaxcounterPacket:", data);
    });

    device.connection.events.onPendingSettingsChange.subscribe((data) => {
        // console.log("onPendingSettingsChange:", data);
    });

    device.connection.events.onPingPacket.subscribe((data) => {
        // console.log("onPingPacket:", data);
    });

    device.connection.events.onPositionPacket.subscribe((data) => {
        // console.log("onPositionPacket:", data);
    });

    device.connection.events.onPrivatePacket.subscribe((data) => {
        // console.log("onPrivatePacket:", data);
    });

    device.connection.events.onQueueStatus.subscribe((data) => {
        // console.log("onQueueStatus:", data);
    });

    device.connection.events.onRangeTestPacket.subscribe((data) => {
        // console.log("onRangeTestPacket:", data);
    });

    device.connection.events.onRemoteHardwarePacket.subscribe((data) => {
        // console.log("onRemoteHardwarePacket:", data);
    });

    device.connection.events.onRoutingPacket.subscribe((data) => {
        // console.log("onRoutingPacket:", data);
    });

    device.connection.events.onSerialPacket.subscribe((data) => {
        // console.log("onSerialPacket:", data);
    });

    device.connection.events.onSimulatorPacket.subscribe((data) => {
        // console.log("onSimulatorPacket:", data);
    });

    device.connection.events.onStoreForwardPacket.subscribe((data) => {
        // console.log("onStoreForwardPacket:", data);
    });

    device.connection.events.onTelemetryPacket.subscribe((data) => {
        // console.log("onTelemetryPacket:", data);
    });

    device.connection.events.onTraceRoutePacket.subscribe((data) => {
        // console.log("onTraceRoutePacket:", data);
    });

    device.connection.events.onUserPacket.subscribe((data) => {
        console.log("onUserPacket:", data);
        device.users.push(data.data);
    });

    device.connection.events.onWaypointPacket.subscribe((data) => {
        // console.log("onWaypointPacket:", data);
    });

    device.connection.events.onZpsPacket.subscribe((data) => {
        // console.log("onZpsPacket:", data);
    });
}
