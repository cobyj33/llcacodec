"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLifeFileFormat = exports.readLifeFile = exports.readPatternCoordinatesFromFile = void 0;
const life106_1 = require("./formats/life106");
const plaintext_1 = require("./formats/plaintext");
function readPatternCoordinatesFromFile(data, format) {
    switch (format) {
        case "plaintext": return (0, plaintext_1.readPlainTextString)(data).cellCoordinates;
        case "Life 1.06": return (0, life106_1.readLife106String)(data);
        case "": {
            const format = getLifeFileFormat(data);
            if (format !== "N/A") {
                return readPatternCoordinatesFromFile(data, format);
            }
            throw new Error("");
        }
    }
    throw new Error("");
}
exports.readPatternCoordinatesFromFile = readPatternCoordinatesFromFile;
function readLifeFile(data, format = "") {
    switch (format) {
        case "plaintext": return (0, plaintext_1.readPlainTextString)(data);
        case "Life 1.06": return (0, life106_1.readLife106String)(data);
        case "": {
            const format = getLifeFileFormat(data);
            if (format === "plaintext") {
                return readLifeFile(data, format);
            }
            else if (format === "Life 1.06") {
                return readLifeFile(data, format);
            }
            throw new Error("");
        }
    }
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
