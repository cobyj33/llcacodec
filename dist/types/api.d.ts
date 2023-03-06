import { PlainTextStringDecodedContents } from "./formats/plaintext";
type SupportedLifeLikeFormats = "Life 1.06" | "plaintext";
export declare function readPatternCoordinatesFromFile<T extends SupportedLifeLikeFormats>(data: string, format: T | ""): [number, number][];
export declare function readLifeFile(data: string, format: "plaintext"): PlainTextStringDecodedContents;
export declare function readLifeFile(data: string, format: "Life 1.06"): [number, number][];
export declare function getLifeFileFormat(data: string): SupportedLifeLikeFormats | "N/A";
export {};
//# sourceMappingURL=api.d.ts.map