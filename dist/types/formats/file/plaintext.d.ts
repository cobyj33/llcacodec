export interface PlaintextDecodedData {
    format: "plaintext";
    name: string;
    description: string[];
    matrix: (0 | 1)[][];
    liveCoordinates: [number, number][];
}
export interface PlaintextMatrixEncodingData {
    name: string;
    description: string | string[];
    matrix: (0 | 1)[][];
}
export declare function isPlaintextMatrixEncodingData(data: unknown): data is PlaintextMatrixEncodingData;
export interface PlaintextCoordinateEncodingData {
    name: string;
    description: string | string[];
    liveCoordinates: [number, number][];
}
export declare function isPlaintextCoordinateEncodingData(data: unknown): data is PlaintextCoordinateEncodingData;
export declare function writePlaintextString(data: PlaintextMatrixEncodingData | PlaintextCoordinateEncodingData): string;
export declare function isPlaintextString(str: string): boolean;
export declare function readPlaintextString(str: string): PlaintextDecodedData;
export declare function readPlaintextDiagramToXY(str: string): [number, number][];
export declare function readPlaintextDiagramToMatrix(str: string): (0 | 1)[][];
export declare function isPlaintextDiagram(line: string): boolean;
//# sourceMappingURL=plaintext.d.ts.map