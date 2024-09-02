export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

export function scale(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin);
}

export function randomU32() {
    return Math.floor(Math.random() * 1e9);
}