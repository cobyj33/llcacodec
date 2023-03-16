import { PlainTextStringDecodedContents } from "formats/file/plaintext";
import { RLEFileData } from "formats/file/rle";
import { Life105FileData } from "formats/file/life105";
type SupportedLifeLikeFormats = "life 1.06" | "life 1.05" | "plaintext" | "rle";
export declare function readPatternCoordinatesFromFile<T extends SupportedLifeLikeFormats>(data: string, format: T | ""): [number, number][];
export declare function readLifeFile(data: string, format: "plaintext"): PlainTextStringDecodedContents;
export declare function readLifeFile(data: string, format: "life 1.06"): [number, number][];
export declare function readLifeFile(data: string, format: "rle"): RLEFileData;
export declare function readLifeFile(data: string, format: "life 1.05"): Life105FileData;
export declare function getLifeFileFormat(data: string): SupportedLifeLikeFormats | "N/A";
export {};
//# sourceMappingURL=api.d.ts.map