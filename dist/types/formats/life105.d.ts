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
    cellCoordinates: [number, number][];
}
interface Life105FileData {
    cellBlocks: Life105CellBlock[];
    cellCoordinates: [number, number][];
    descriptions: string[];
    ruleString: string | null;
    rule: LifeRuleData | null;
    hashLines: HashLine[];
}
export declare function readLife105File(file: string): Life105FileData;
export declare function hello(): number;
export {};
//# sourceMappingURL=life105.d.ts.map