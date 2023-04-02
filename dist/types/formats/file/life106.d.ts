export declare function isLife106String(str: string): boolean;
export interface Life106DecodedData {
    format: "life 1.06";
    liveCoordinates: [number, number][];
}
export interface Life106EncodingData {
    liveCoordinates: [number, number][];
}
export declare function writeLife106String(data: Life106EncodingData): string;
export declare function readLife106String(str: string): Life106DecodedData;
//# sourceMappingURL=life106.d.ts.map