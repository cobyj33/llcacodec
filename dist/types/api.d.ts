import { Life106DecodedData, Life106EncodingData } from "./formats/file/life106";
import { PlaintextDecodedData, PlaintextMatrixWriteData, PlaintextCoordinateWriteData } from "./formats/file/plaintext";
import { RLECoordinateEncodingData, RLEDecodedData, RLEMatrixEncodingData } from "./formats/file/rle";
import { Life105DecodedData } from "./formats/file/life105";
export { LifeRuleData, CONWAY_LIFE_RULE_DATA } from "./formats/rule/ruleData";
export { readLifeRule, makeLifeRule, isValidLifeRule, getLifeRuleFormat } from "./formats/rule";
type SupportedLifeLikeFormats = "life 1.06" | "life 1.05" | "plaintext" | "rle";
export declare function readLifeString(data: string, format: "plaintext"): PlaintextDecodedData;
export declare function readLifeString(data: string, format: "life 1.06"): Life106DecodedData;
export declare function readLifeString(data: string, format: "rle"): RLEDecodedData;
export declare function readLifeString(data: string, format: "life 1.05"): Life105DecodedData;
export declare function readLifeString(data: string): Life106DecodedData | PlaintextDecodedData | RLEDecodedData | Life105DecodedData;
export declare function isLifeStringFormat(data: string, format: SupportedLifeLikeFormats): boolean;
export declare function getLifeFileFormat(data: string): SupportedLifeLikeFormats | "";
type FileFormatData = (Life106EncodingData & {
    format: "life 1.06";
}) | (PlaintextMatrixWriteData & {
    format: "plaintext";
}) | (PlaintextCoordinateWriteData & {
    format: "plaintext";
}) | (RLEMatrixEncodingData & {
    format: "rle";
}) | (RLECoordinateEncodingData & {
    format: "rle";
});
export declare function writeLifeString(data: FileFormatData): string;
//# sourceMappingURL=api.d.ts.map