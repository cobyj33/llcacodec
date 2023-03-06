"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLifeFileFormat = exports.readLifeFile = void 0;
const life106_1 = require("../formats/life106");
const plaintext_1 = require("../formats/plaintext");
function readLifeFile(data, format) {
    switch (format) {
        case "plaintext": return (0, plaintext_1.readPlainTextString)(data);
        case "Life 1.06": return (0, life106_1.readLife106String)(data);
    }
    throw new Error("");
}
exports.readLifeFile = readLifeFile;
function getLifeFileFormat(data) {
    if ((0, life106_1.isLife106String)(data)) {
        return "Life 1.06";
    }
    if ((0, plaintext_1.isPlainTextString)(data)) {
        return "plaintext";
    }
    return "N/A";
}
exports.getLifeFileFormat = getLifeFileFormat;
