
export const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

export const scale = (number, inMin, inMax, outMin, outMax) => ((number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin);

export const DeviceStatus = Object.freeze({
    Restarting: 1,
    Disconnected: 2,
    Connecting: 3,
    Reconnecting: 4,
    Connected: 5,
    Configuring: 6,
    Configured: 7,
});
