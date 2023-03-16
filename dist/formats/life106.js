"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readLife106String = exports.isLife106String = exports.writeLife106String = void 0;
const util_1 = require("../core/util");
const util_2 = require("../core/util");
const set2D_1 = require("../core/set2D");
const LIFE_106_HEADER = "#Life 1.06";
const LIFE_106_FILE_EXTENSIONS = [".lif", ".life"];
function writeLife106String(data) {
    const byteArray = [];
    (0, util_1.pushUTFBytes)(byteArray, LIFE_106_HEADER + "\n");
    const dupSet = new set2D_1.Set2D();
    for (let i = 0; i < data.length; i++) {
        const [x, y] = data[i];
        if (dupSet.has(x, y)) {
            continue;
        }
        (0, util_1.pushUTFBytes)(byteArray, `${x} ${y}\n`);
        dupSet.add(x, y);
    }
    return (0, util_1.byteArrayAsString)(byteArray);
}
exports.writeLife106String = writeLife106String;
function isLife106String(str) {
    return str.trim().startsWith(LIFE_106_HEADER);
}
exports.isLife106String = isLife106String;
function readLife106String(str) {
    if (str.trim().startsWith(LIFE_106_HEADER)) {
        const output = [];
        const set2D = new set2D_1.Set2D();
        const lines = str.split("\n");
        let ended = false;
        for (let i = 1; i < lines.length; i++) {
            const nums = lines[i].trim().split(" ").filter(val => val.length > 0);
            if (nums.length !== 2) {
                if (nums.length === 0) { // Check if there are any extra lines at the end. This is true if there is no input or if all input is empty strings
                    ended = true;
                    continue;
                }
                throw new Error(`Invalid Life 1.06 string. Error at Line ${i}. There must be an X and a Y position only on subsequent lines after the Life 1.06 Header \n${str}\n `);
            }
            if (ended) {
                throw new Error(`Invalid Life 1.06 string: \n${str}\n Error at Line ${i}. X and Y Values must be on subsequent lines`);
            }
            if ((0, util_2.isIntegerString)(nums[0]) && (0, util_2.isIntegerString)(nums[1])) {
                const [x, y] = [Number.parseInt(nums[0]), Number.parseInt(nums[1])];
                if (!set2D.has(x, y)) {
                    set2D.add(x, y);
                    output.push([x, y]);
                }
            }
            else {
                throw new Error(`Invalid Life 1.06 string. Error at Line ${i}. Cell positions must be integers ( got ${nums[0]} and ${nums[1]}) \n${str}\n `);
            }
        }
        return output;
    }
    else {
        throw new Error(`Could not read Life 1.06 string. Error at Line 1: does not begin with appropriate header. Must be "${LIFE_106_HEADER}" ${str}`);
    }
}
exports.readLife106String = readLife106String;
