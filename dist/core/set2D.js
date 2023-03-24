"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniqueNumberPairArray = exports.Set2D = void 0;
class Set2D {
    constructor(values = []) {
        this.map = new Map();
        this._length = 0;
        if (Array.isArray(values)) {
            values.forEach(value => this.add(value[0], value[1]));
        }
        else {
            values.forEach(([first, second]) => this.add(first, second));
        }
    }
    fullClear() {
        this.map = new Map();
        this._length = 0;
    }
    clear() {
        [...this.map.values()].forEach(set => set.clear());
        this._length = 0;
    }
    get length() { return this._length; }
    static fromNumberMatrix(values) {
        const set = new Set2D();
        for (let row = 0; row < values.length; row++) {
            for (let col = 0; col < values[row].length; col++) {
                if (values[row][col] === 1) {
                    set.add(row, col);
                }
            }
        }
        return set;
    }
    getTuples() {
        const arr = new Array(this.length);
        let i = 0;
        this.forEach((pair) => {
            arr[i] = pair;
            i++;
        });
        return arr;
    }
    forEach(callbackfn) {
        this.map.forEach((set, first) => set.forEach(second => callbackfn([first, second])));
    }
    add(first, second) {
        var _a, _b;
        if (((_a = this.map.get(first)) === null || _a === void 0 ? void 0 : _a.has(second)) === false) {
            (_b = this.map.get(first)) === null || _b === void 0 ? void 0 : _b.add(second);
            this._length += 1;
        }
        else if (this.map.has(first) === false) {
            this.map.set(first, new Set([second]));
            this._length += 1;
        }
    }
    remove(first, second) {
        let set;
        if (set = this.map.get(first)) {
            if (set.has(second)) {
                set.delete(second);
                this._length -= 1;
                // if (set.size === 0) { 
                //     this.map.delete(first)
                // }
            }
        }
    }
    has(first, second) {
        var _a;
        return ((_a = this.map.get(first)) === null || _a === void 0 ? void 0 : _a.has(second)) || false;
    }
    hasAll(tuples) {
        return tuples.every(tuple => this.has(tuple[0], tuple[1]));
    }
    hasAllExact(tuples) {
        return tuples.length === this.length && this.hasAll(tuples);
    }
    combine(...others) {
        const set = new Set2D();
        set.push(this, ...others);
        return set;
    }
    push(...others) {
        others.forEach(other => other.forEach(tuple => this.add(tuple[0], tuple[1])));
    }
    *[Symbol.iterator]() {
        for (const pair of this.map) {
            for (const second of pair[1]) {
                yield [pair[0], second];
            }
        }
    }
    equals(other) {
        if (this.length !== other.length) {
            return false;
        }
        for (const entry of this) {
            if (other.has(entry[0], entry[1]) === false) {
                return false;
            }
        }
        return true;
    }
}
exports.Set2D = Set2D;
function uniqueNumberPairArray(arr) {
    const set2D = new Set2D();
    const output = [];
    for (let i = 0; i < arr.length; i++) {
        if (set2D.has(arr[i][0], arr[i][1])) {
            continue;
        }
        output.push([...arr[i]]);
        set2D.add(arr[i][0], arr[i][1]);
    }
    return output;
}
exports.uniqueNumberPairArray = uniqueNumberPairArray;
