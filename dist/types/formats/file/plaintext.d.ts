export interface PlainTextDecodedData {
    name: string;
    description: string[];
    matrix: (0 | 1)[][];
    liveCoordinates: [number, number][];
}
export declare function writePlainTextFromCoordinates(positions: [number, number][], name: string, description: string | string[]): string;
export declare function writePlainTextMatrix(data: (0 | 1)[][], name: string, description: string | string[]): string;
export declare function isPlainTextString(str: string): boolean;
export declare function readPlainTextString(str: string): PlainTextDecodedData;
export declare function readPlainTextDiagramToXY(str: string): [number, number][];
export declare function readPlainTextDiagramToMatrix(str: string): (0 | 1)[][];
export declare function isPlainTextDiagram(line: string): boolean;
//# sourceMappingURL=plaintext.d.ts.map