type LifeRuleData = {
    birth: number[];
    survival: number[];
};
interface HashLine {
    id: string;
    content: string;
    full: string;
}
interface Life105CellBlock {
    x: number;
    y: number;
    width: number;
    height: number;
    pattern: (0 | 1)[][];
    liveCoordinates: [number, number][];
}
export interface Life105DecodedData {
    format: "life 1.05";
    cellBlocks: Life105CellBlock[];
    liveCoordinates: [number, number][];
    descriptions: string[];
    ruleString: string | null;
    rule: LifeRuleData | null;
    hashLines: HashLine[];
}
export declare function isLife105String(file: string): boolean;
export declare function readLife105String(file: string): Life105DecodedData;
export {};
//# sourceMappingURL=life105.d.ts.map