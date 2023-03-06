import { LifeRuleData } from "./rule";
interface HashLine {
    id: string;
    content: string;
    full: string;
}
interface RLEFileData {
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
interface RLEData {
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
export declare function readRLEData(rlePattern: string, topleft?: [number, number]): RLEData;
export declare function readRLEFileHeader(headerLine: string): RLEFileHeaderData;
export declare function readRLEFile(file: string): RLEFileData;
export {};
//# sourceMappingURL=rle.d.ts.map