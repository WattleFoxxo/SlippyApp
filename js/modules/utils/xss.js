export function XSSEncode(str) {
    return str.toString().replace(new RegExp("[\u00A0-\u9999<>\&]", "g"), (i) => {
        return '&#' + i.charCodeAt(0) + ';';
    });
}
