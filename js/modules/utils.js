export let XSSEncode = (str) => {
    return str.toString().replace(/[\u00A0-\u9999<>\&]/g, function(i) {
        return '&#' + i.charCodeAt(0) + ';';
    });
}

export const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

export const scale = (number, inMin, inMax, outMin, outMax) => ((number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin);
