import { LifeRuleData } from "../rule";
interface HashLine {
    id: string;
    content: string;
    full: string;
}
export interface RLEDecodedData {
    format: "rle";
    comments: string[];
    name: string;
    topleft: [number, number];
    foundTopLeft: boolean;
    width: number;
    height: number;
    ruleString: string;
    rule: LifeRuleData;
    liveCoordinates: [number, number][];
    hashLines: HashLine[];
    creationData: string;
}
interface RLEHeaderDecodedData {
    width: number;
    height: number;
    ruleString: string | null;
    rule: LifeRuleData | null;
    full: string;
}
interface RLECommonEncodingData {
    name?: string;
    rule?: string | number | LifeRuleData;
    comments?: string[];
    creationData?: string;
}
export interface RLEMatrixEncodingData extends RLECommonEncodingData {
    topleft: [number, number];
    matrix: (0 | 1)[][];
}
export interface RLECoordinateEncodingData extends RLECommonEncodingData {
    liveCoordinates: [number, number][];
}
interface ParsedRLEData {
    liveCoordinates: [number, number][];
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
export declare function readRLEStringHeader(headerLine: string): RLEHeaderDecodedData;
export declare function isRLEString(file: string): boolean;
export declare function readRLEString(file: string): RLEDecodedData;
export declare function writeRLEString(data: RLEMatrixEncodingData | RLECoordinateEncodingData): string;
export {};
//# sourceMappingURL=rle.d.ts.map