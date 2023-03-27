export declare class Set2D {
    private map;
    private _length;
    constructor(values?: Array<[number, number]> | Set2D);
    fullClear(): void;
    clear(): void;
    get length(): number;
    static fromNumberMatrix(values: number[][]): Set2D;
    getTuples(): Array<[number, number]>;
    forEach(callbackfn: (curr: [number, number]) => void): void;
    add(first: number, second: number): void;
    remove(first: number, second: number): void;
    has(first: number, second: number): boolean;
    hasAll(tuples: Array<[number, number]>): boolean;
    hasAllExact(tuples: Array<[number, number]>): boolean;
    combine(...others: Set2D[]): Set2D;
    push(...others: Set2D[]): void;
    [Symbol.iterator](): IterableIterator<[number, number]>;
    equals(other: Set2D): boolean;
}
//# sourceMappingURL=set2D.d.ts.map