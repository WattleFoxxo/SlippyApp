
function subscribeToAll() {
    connection.events.onAtakForwarderPacket.subscribe((data) => {
        // console.log("onAtakForwarderPacket:", data);
    });

    connection.events.onAudioPacket.subscribe((data) => {
        // console.log("onAudioPacket:", data);
    });

    connection.events.onChannelPacket.subscribe((data) => {
        // console.log("onChannelPacket:", data);
    });

    connection.events.onConfigPacket.subscribe((data) => {
        // console.log("onConfigPacket:", data);
    });

    connection.events.onDetectionSensorPacket.subscribe((data) => {
        // console.log("onDetectionSensorPacket:", data);
    });

    connection.events.onDeviceDebugLog.subscribe((data) => {
        // console.log("onDeviceDebugLog:", data);
    });

    connection.events.onDeviceMetadataPacket.subscribe((data) => {
        // console.log("onDeviceMetadataPacket:", data);
    });

    connection.events.onFromRadio.subscribe((data) => {
        // console.log("onFromRadio:", data);
    });

    connection.events.onIpTunnelPacket.subscribe((data) => {
        // console.log("onIpTunnelPacket:", data);
    });

    connection.events.onLogEvent.subscribe((data) => {
        // console.log("onLogEvent:", data);
    });

    connection.events.onLogRecord.subscribe((data) => {
        // console.log("onLogRecord:", data);
    });

    connection.events.onMapReportPacket.subscribe((data) => {
        // console.log("onMapReportPacket:", data);
    });

    connection.events.onMeshHeartbeat.subscribe((data) => {
        // console.log("onMeshHeartbeat:", data);
    });

    connection.events.onMeshPacket.subscribe((data) => {
        // console.log("onMeshPacket:", data);
    });

    connection.events.onMessagePacket.subscribe((data) => {
        // console.log("onMessagePacket:", data);
    });

    connection.events.onModuleConfigPacket.subscribe((data) => {
        // console.log("onModuleConfigPacket:", data);
    });

    connection.events.onMyNodeInfo.subscribe((data) => {
        myDevice.myNodeNum = data.myNodeNum;
        console.log("onMyNodeInfo:", data);
    });

    connection.events.onNeighborInfoPacket.subscribe((data) => {
        // console.log("onNeighborInfoPacket:", data);
    });

    connection.events.onNodeInfoPacket.subscribe((data) => {
        myDevice.nodes.push(data);
        console.log("onNodeInfoPacket:", data);
    });

    connection.events.onPaxcounterPacket.subscribe((data) => {
        // console.log("onPaxcounterPacket:", data);
    });

    connection.events.onPendingSettingsChange.subscribe((data) => {
        // console.log("onPendingSettingsChange:", data);
    });

    connection.events.onPingPacket.subscribe((data) => {
        // console.log("onPingPacket:", data);
    });

    connection.events.onPositionPacket.subscribe((data) => {
        // console.log("onPositionPacket:", data);
    });

    connection.events.onPrivatePacket.subscribe((data) => {
        // console.log("onPrivatePacket:", data);
    });

    connection.events.onQueueStatus.subscribe((data) => {
        // console.log("onQueueStatus:", data);
    });

    connection.events.onRangeTestPacket.subscribe((data) => {
        // console.log("onRangeTestPacket:", data);
    });

    connection.events.onRemoteHardwarePacket.subscribe((data) => {
        // console.log("onRemoteHardwarePacket:", data);
    });

    connection.events.onRoutingPacket.subscribe((data) => {
        // console.log("onRoutingPacket:", data);
    });

    connection.events.onSerialPacket.subscribe((data) => {
        // console.log("onSerialPacket:", data);
    });

    connection.events.onSimulatorPacket.subscribe((data) => {
        // console.log("onSimulatorPacket:", data);
    });

    connection.events.onStoreForwardPacket.subscribe((data) => {
        // console.log("onStoreForwardPacket:", data);
    });

    connection.events.onTelemetryPacket.subscribe((data) => {
        // console.log("onTelemetryPacket:", data);
    });

    connection.events.onTraceRoutePacket.subscribe((data) => {
        // console.log("onTraceRoutePacket:", data);
    });

    connection.events.onUserPacket.subscribe((data) => {
        myDevice.users.push(data.data);
        console.log("onUserPacket:", data);
    });

    connection.events.onWaypointPacket.subscribe((data) => {
        // console.log("onWaypointPacket:", data);
    });

    connection.events.onZpsPacket.subscribe((data) => {
        // console.log("onZpsPacket:", data);
    });

}
