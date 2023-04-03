export interface PlaintextDecodedData {
    format: "plaintext";
    name: string;
    description: string[];
    matrix: (0 | 1)[][];
    liveCoordinates: [number, number][];
}
export interface PlaintextMatrixWriteData {
    name: string;
    description: string | string[];
    matrix: (0 | 1)[][];
}
export declare function isPlaintextMatrixWriteData(data: unknown): data is PlaintextMatrixWriteData;
export interface PlaintextCoordinateWriteData {
    name: string;
    description: string | string[];
    liveCoordinates: [number, number][];
}
export declare function isPlaintextCoordinateWriteData(data: unknown): data is PlaintextCoordinateWriteData;
export declare function writePlaintextString(data: PlaintextMatrixWriteData | PlaintextCoordinateWriteData): string;
export declare function isPlaintextString(str: string): boolean;
export declare function readPlaintextString(str: string): PlaintextDecodedData;
export declare function readPlaintextDiagramToXY(str: string): [number, number][];
export declare function readPlaintextDiagramToMatrix(str: string): (0 | 1)[][];
export declare function isPlaintextDiagram(line: string): boolean;
//# sourceMappingURL=plaintext.d.ts.map