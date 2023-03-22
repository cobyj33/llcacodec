"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLifeFileFormat = exports.readLifeFile = exports.readPatternCoordinatesFromFile = void 0;
const life106_1 = require("formats/file/life106");
const plaintext_1 = require("formats/file/plaintext");
const rle_1 = require("formats/file/rle");
const life105_1 = require("formats/file/life105");
function readPatternCoordinatesFromFile(data, format) {
    switch (format) {
        case "plaintext": return (0, plaintext_1.readPlainTextString)(data).cellCoordinates;
        case "life 1.06": return (0, life106_1.readLife106String)(data);
        case "life 1.05": return (0, life105_1.readLife105String)(data).cellCoordinates;
        case "rle": return (0, rle_1.readRLEString)(data).coordinates;
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
    const foundFormat = format === "" ? getLifeFileFormat(data) : format;
    switch (foundFormat) {
        case "plaintext": return (0, plaintext_1.readPlainTextString)(data);
        case "life 1.06": return (0, life106_1.readLife106String)(data);
        case "rle": return (0, rle_1.readRLEString)(data);
        case "life 1.05": return (0, life105_1.readLife105String)(data);
        case "N/A": throw new Error(`[libcaread] Could not read life file: matching life file format could not be found`);
    }
}
exports.readLifeFile = readLifeFile;
function getLifeFileFormat(data) {
    if ((0, life106_1.isLife106String)(data)) {
        return "life 1.06";
    }
    else if ((0, plaintext_1.isPlainTextString)(data)) {
        return "plaintext";
    }
    else if ((0, rle_1.isRLEString)(data)) {
        return "rle";
    }
    else if ((0, life105_1.isLife105String)(data)) {
        return "life 1.05";
    }
    return "N/A";
}
exports.getLifeFileFormat = getLifeFileFormat;
