import { readLife106String } from "../formats/life106";
import { readPlainTextString } from "../formats/plaintext";
type SupportedLifeLikeFormats = "Life 1.06" | "plaintext";
type ReturnedFileData<T> = T extends "plaintext" ? ReturnType<typeof readPlainTextString> : T extends "Life 1.06" ? ReturnType<typeof readLife106String> : never;
export declare function readLifeFile<T extends SupportedLifeLikeFormats>(data: string, format: T): ReturnedFileData<T>;
export declare function getLifeFileFormat(data: string): SupportedLifeLikeFormats | "N/A";
export {};
//# sourceMappingURL=read.d.ts.map