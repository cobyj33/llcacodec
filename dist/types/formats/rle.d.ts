import { LifeRuleData } from "./rule";
interface HashLine {
    id: string;
    content: string;
    full: string;
}
export interface RLEFileData {
    comments: string[];
    name: string;
    topleft: [number, number] | null;
    width: number;
    height: number;
    ruleString: string;
    rule: LifeRuleData;
    coordinates: [number, number][];
    hashLines: HashLine[];
    creationData: string;
}
interface RLEFileHeaderData {
    width: number;
    height: number;
    ruleString: string | null;
    rule: LifeRuleData | null;
    full: string;
}
interface ParsedRLEData {
    coordinates: [number, number][];
    pattern: string;
    endingIndex: number;
    readonly topleft: [number, number];
}
/**
 * Must start
 *
 * Must end with ! or have no more data at the end at the end (please end your RLE data with a !)
 *
 * @param rleData
 */
export declare function readRLEData(rlePattern: string, topleft?: [number, number]): ParsedRLEData;
export declare function readRLEStringHeader(headerLine: string): RLEFileHeaderData;
export declare function isRLEString(file: string): boolean;
export declare function readRLEString(file: string): RLEFileData;
export {};
//# sourceMappingURL=rle.d.ts.map