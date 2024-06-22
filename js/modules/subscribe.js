import { refreshPage } from "../index.js";
import { Logging } from "./definitions.js";


export function toAll(device) {
    device.connection.events.onAtakForwarderPacket.subscribe((data) => {
        // console.log(Logging.debug, "onAtakForwarderPacket:", data);
    });

    device.connection.events.onAudioPacket.subscribe((data) => {
        // console.log(Logging.debug, "onAudioPacket:", data);
    });

    device.connection.events.onChannelPacket.subscribe((data) => {
        console.log(Logging.debug, "onChannelPacket:", data);
        device.channels[data.index] = data;

        refreshPage();
    });

    device.connection.events.onConfigPacket.subscribe((data) => {
        console.log(Logging.debug, "onConfigPacket:", data);
    });

    device.connection.events.onDetectionSensorPacket.subscribe((data) => {
        // console.log(Logging.debug, "onDetectionSensorPacket:", data);
    });

    device.connection.events.onDeviceDebugLog.subscribe((data) => {
        console.log(Logging.debug, "onDeviceDebugLog:", data);
    });

    device.connection.events.onDeviceMetadataPacket.subscribe((data) => {
        // console.log(Logging.debug, "onDeviceMetadataPacket:", data);
    });

    device.connection.events.onFromRadio.subscribe((data) => {
        // console.log(Logging.debug, "onFromRadio:", data);
    });

    device.connection.events.onIpTunnelPacket.subscribe((data) => {
        // console.log(Logging.debug, "onIpTunnelPacket:", data);
    });

    device.connection.events.onLogEvent.subscribe((data) => {
        console.log(Logging.debug, "onLogEvent:", data);
    });

    device.connection.events.onLogRecord.subscribe((data) => {
        console.log(Logging.debug, "onLogRecord:", data);
    });

    device.connection.events.onMapReportPacket.subscribe((data) => {
        // console.log(Logging.debug, "onMapReportPacket:", data);
    });

    device.connection.events.onMeshHeartbeat.subscribe((data) => {
        console.log(Logging.debug, "onMeshHeartbeat:", data);
    });

    device.connection.events.onMeshPacket.subscribe((data) => {
        // console.log(Logging.debug, "onMeshPacket:", data);
    });

    device.connection.events.onMessagePacket.subscribe((data) => {
        console.log(Logging.debug, "onMessagePacket:", data);

        if (!(data.from in device.messages)) device.messages[data.from] = [];
        device.messages[data.from].push(data);

        refreshPage();
    });

    device.connection.events.onModuleConfigPacket.subscribe((data) => {
        // console.log(Logging.debug, "onModuleConfigPacket:", data);
    });

    device.connection.events.onMyNodeInfo.subscribe((data) => {
        console.log(Logging.debug, "onMyNodeInfo:", data);
        device.myNodeNum = data.myNodeNum;
    });

    device.connection.events.onNeighborInfoPacket.subscribe((data) => {
        // console.log(Logging.debug, "onNeighborInfoPacket:", data);
    });

    device.connection.events.onNodeInfoPacket.subscribe((data) => {
        console.log(Logging.debug, "onNodeInfoPacket:", data);
        device.nodes[data.num] = data;

        refreshPage();
    });

    device.connection.events.onPaxcounterPacket.subscribe((data) => {
        // console.log(Logging.debug, "onPaxcounterPacket:", data);
    });

    device.connection.events.onPendingSettingsChange.subscribe((data) => {
        // console.log(Logging.debug, "onPendingSettingsChange:", data);
    });

    device.connection.events.onPingPacket.subscribe((data) => {
        // console.log(Logging.debug, "onPingPacket:", data);
    });

    device.connection.events.onPositionPacket.subscribe((data) => {
        console.log(Logging.debug, "onPositionPacket:", data);
        device.nodes[data.from].position = data.data;

        refreshPage();
    });

    device.connection.events.onPrivatePacket.subscribe((data) => {
        console.log(Logging.debug, "onPrivatePacket:", data);
    });

    device.connection.events.onQueueStatus.subscribe((data) => {
        console.log(Logging.debug, "onQueueStatus:", data);
    });

    device.connection.events.onRangeTestPacket.subscribe((data) => {
        // console.log(Logging.debug, "onRangeTestPacket:", data);
    });

    device.connection.events.onRemoteHardwarePacket.subscribe((data) => {
        // console.log(Logging.debug, "onRemoteHardwarePacket:", data);
    });

    device.connection.events.onRoutingPacket.subscribe((data) => {
        // console.log(Logging.debug, "onRoutingPacket:", data);
    });

    device.connection.events.onSerialPacket.subscribe((data) => {
        // console.log(Logging.debug, "onSerialPacket:", data);
    });

    device.connection.events.onSimulatorPacket.subscribe((data) => {
        // console.log(Logging.debug, "onSimulatorPacket:", data);
    });

    device.connection.events.onStoreForwardPacket.subscribe((data) => {
        // console.log(Logging.debug, "onStoreForwardPacket:", data);
    });

    device.connection.events.onTelemetryPacket.subscribe((data) => {
        // console.log(Logging.debug, "onTelemetryPacket:", data);
    });

    device.connection.events.onTraceRoutePacket.subscribe((data) => {
        console.log(Logging.debug, "onTraceRoutePacket:", data);
    });

    device.connection.events.onUserPacket.subscribe((data) => {
        console.log(Logging.debug, "onUserPacket:", data);
        device.users.push(data.data);
    });

    device.connection.events.onWaypointPacket.subscribe((data) => {
        // console.log(Logging.debug, "onWaypointPacket:", data);
    });

    device.connection.events.onZpsPacket.subscribe((data) => {
        // console.log(Logging.debug, "onZpsPacket:", data);
    });
}
