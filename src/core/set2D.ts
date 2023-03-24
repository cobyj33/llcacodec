export class Set2D {
    private map: Map<number, Set<number>> = new Map<number, Set<number>>();
    private _length: number;

    constructor(values: Array<[number, number]> | Set2D = []) {
        this._length = 0;

        if (Array.isArray(values)) {
            values.forEach(value => this.add(value[0], value[1])); 
        } else {
            values.forEach(([first, second]) => this.add(first, second))
        }
    }

    fullClear() {
        this.map = new Map();
        this._length = 0;
    }

    clear() {
        [...this.map.values()].forEach(set => set.clear())
        this._length = 0;
    }

    get length(): number { return this._length } 

    static fromNumberMatrix(values: number[][]): Set2D {
        const set = new Set2D();
        for (let row = 0; row < values.length; row++) {
            for (let col = 0; col < values[row].length; col++) {
                if (values[row][col] === 1) {
                    set.add(row, col)
                }
            }
        }
        return set;
    }

    getTuples(): Array<[number, number]> {
        const arr = new Array<[number, number]>(this.length)
        let i = 0;
        this.forEach((pair) => {
            arr[i] = pair
            i++;
        })

        return arr
    }

    forEach(callbackfn: (curr: [number, number]) => void) {
        this.map.forEach((set, first) => set.forEach(second => callbackfn([first, second])   ))
    }
    

    add(first: number, second: number): void {
        if (this.map.get(first)?.has(second) === false) {
            this.map.get(first)?.add(second); 
            this._length += 1;
        } else if (this.map.has(first) === false) {
            this.map.set(first, new Set<number>([second]))
            this._length += 1;
        }

    }

    remove(first: number, second: number): void {
        let set: Set<number> | undefined
        if (set = this.map.get(first)) {
            if (set.has(second)) {
                set.delete(second)
                this._length -= 1;
                // if (set.size === 0) { 
                //     this.map.delete(first)
                // }
            }
        }
    }

    has(first: number, second: number): boolean {
        return this.map.get(first)?.has(second) || false;
    }

    hasAll(tuples: Array<[number, number]>): boolean {
        return tuples.every(tuple => this.has(tuple[0], tuple[1]));
    }

    hasAllExact(tuples: Array<[number, number]>): boolean {
        return tuples.length === this.length && this.hasAll(tuples);
    }

    combine(...others: Set2D[]): Set2D {
        const set = new Set2D();
        set.push(this, ...others);
        return set;
    }

    push(...others: Set2D[]): void {
        others.forEach(other => other.forEach(tuple => this.add(tuple[0], tuple[1])) );
    }

    *[Symbol.iterator](): IterableIterator<[number, number]> {
        for (const pair of this.map) {
            for (const second of pair[1]) {
                yield [pair[0], second]
            }
        }
    }

    equals(other: Set2D): boolean {
        if (this.length !== other.length) {
            return false;
        }
        
        for ( const entry of this ) {
            if (other.has(entry[0], entry[1]) === false) {
                return false;
            }
        }
        return true;
    }
}

export function uniqueNumberPairArray(arr: [number, number][]) {
    const set2D = new Set2D()
    const output: [number, number][] = []
    for (let i = 0; i < arr.length; i++) {
        if (set2D.has(arr[i][0], arr[i][1])) {
            continue;
        }
        output.push([...arr[i]])

        set2D.add(arr[i][0], arr[i][1])
    }
    
    return output;
}