import { PlainTextStringDecodedContents } from "./formats/file/plaintext";
import { RLEFileData } from "./formats/file/rle";
import { Life105FileData } from "./formats/file/life105";
export { LifeRuleData, CONWAY_LIFE_RULE_DATA } from "./formats/rule/ruleData";
export { readLifeRule, makeLifeRule, isValidLifeRule, getLifeRuleFormat } from "./formats/rule";
type SupportedLifeLikeFormats = "life 1.06" | "life 1.05" | "plaintext" | "rle";
export declare function readLifeFileLiveCoordinates<T extends SupportedLifeLikeFormats>(data: string, format: T | ""): [number, number][];
export declare function readLifeFile(data: string, format: "plaintext"): PlainTextStringDecodedContents;
export declare function readLifeFile(data: string, format: "life 1.06"): [number, number][];
export declare function readLifeFile(data: string, format: "rle"): RLEFileData;
export declare function readLifeFile(data: string, format: "life 1.05"): Life105FileData;
export declare function readLifeFile(data: string, format: ""): [number, number][] | PlainTextStringDecodedContents | RLEFileData | Life105FileData;
export declare function getLifeFileFormat(data: string): SupportedLifeLikeFormats | "N/A";
interface PlainTextMatrixWriteData {
    name: string;
    description: string | string[];
    matrix: (0 | 1)[][];
}
interface PlainTextCoordinateWriteData {
    name: string;
    description: string | string[];
    liveCoordinates: [number, number][];
}
export declare function writeLifeFile(format: "life 1.06", data: [number, number][]): string;
export declare function writeLifeFile(format: "plaintext", data: PlainTextMatrixWriteData | PlainTextCoordinateWriteData): string;
//# sourceMappingURL=api.d.ts.map