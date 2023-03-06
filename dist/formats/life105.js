"use strict";
// Life 1.05 File Format Spec: https://conwaylife.com/wiki/Life_1.05
Object.defineProperty(exports, "__esModule", { value: true });
exports.hello = exports.readLife105File = void 0;
const LIFE_105_HEADER = "#Life 1.05";
const MAX_DESCRIPTION_LINE_COUNT = 22;
const LIFE_105_MAX_LINE_LENGTH = 80;
const Life105FileExtensions = [".lif", ".life"];
// export function writeLife105File(pattern: Life105InputPattern[], config: Life105Config): string {
//     const fileData: number[] = []
//     pushUTFBytes(fileData, LIFE_105_HEADER + "\n");
//     return byteArrayAsString(fileData);
// }
function readLife105File() {
    return [];
}
exports.readLife105File = readLife105File;
function hello() {
    return 5;
}
exports.hello = hello;
