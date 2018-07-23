import * as _ from 'lodash';

export type SudokuValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export const sudokuValues: SudokuValue[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export class Sudoku {

    public static getSquareIndex(x: SudokuValue, y: SudokuValue) {
        const i = Math.floor((x - 1) / 3) + 3 * Math.floor((y - 1) / 3);
        // console.log(`getSqureIndex(${x},${y}) = ${i}`);
        return i;
    }

    public static getIndexInSquare(x: SudokuValue, y: SudokuValue) {
        const i = (x - 1) % 3 * 3 + (y - 1) % 3 + 1;
        // console.log(`getIndexInSquare(${x},${y}) = ${i}`);
        return i;
    }

    public static isSudokuValue(v: number | SudokuValue[]): v is SudokuValue {
        return typeof v === 'number' && v >= 1 && v <= 9;
    }

    public static isSudokuValueList(v: number | SudokuValue[]): v is SudokuValue[] {
        return Array.isArray(v) && _.every(v, Sudoku.isSudokuValue);
    }

    public rows: SudokuCollection[] = [];
    public cols: SudokuCollection[] = [];
    public squares: SudokuCollection[] = [];
    public matrix: SudokuFieldModel[][] = [];

    constructor() {
        // first init rows, cols and squares
        for (const i of sudokuValues) {
            this.rows.push(new SudokuCollection('Row', i));
            this.cols.push(new SudokuCollection('Col', i));
            this.squares.push(new SudokuCollection('Squ', i));
        }

        // console.log(this.rows);
        // console.log(this.cols);
        // console.log(this.squares);

        for (const row of sudokuValues) {
            const r: SudokuFieldModel[] = [];
            this.matrix.push(r);
            for (const col of sudokuValues) {
                const cell = new SudokuFieldModel(row, col,
                    this.getRow(row), this.getCol(col), this.getSquare(row, col));
                r.push(cell);
            }
        }

    }

    public getModel(x: SudokuValue, y: SudokuValue) {
        return this.matrix[x - 1][y - 1];
    }

    public getRow(y: SudokuValue) {
        return this.rows[y - 1];
    }

    public getCol(x: SudokuValue) {
        return this.cols[x - 1];
    }

    public getSquare(x: SudokuValue, y: SudokuValue) {
        return this.squares[Sudoku.getSquareIndex(x, y)];
    }

    public clearActive() {
        for (const row of sudokuValues) {
            for (const col of sudokuValues) {
                this.getModel(row, col).setInactive();
            }
        }
    }

    public setActive(x: SudokuValue, y: SudokuValue) {
        this.clearActive();
        this.getModel(x, y).setActive();
    }

    public getActiveCells() {
        const result = [];
        for (const row of sudokuValues) {
            for (const col of sudokuValues) {
                const m = this.getModel(row, col);
                if (m.active) {
                    result.push(m);
                }
            }
        }
        return result;
    }

    public setValueOfActiveCell(v: string) {
        for (const m of this.getActiveCells()) {
            m.setValue(parseInt(v, 10));
        }
    }

    public hideErrors() {
        for (const row of sudokuValues) {
            for (const col of sudokuValues) {
                const m = this.getModel(row, col);
                m.error = false;
            }
        }
    }

    public showErrors() {
        this.hideErrors();
        for (const row of this.rows) {
            // console.log(`validate row ${row}`);
            row.showErrors();
        }
        for (const col of this.cols) {
            // console.log(`validate col ${col}`);
            col.showErrors();
        }
        for (const square of this.squares) {
            // console.log(`validate square ${square}`);
            square.showErrors();
        }
    }

    // reset, load and save

    public reset() {
        for (const row of sudokuValues) {
            for (const col of sudokuValues) {
                const m = this.getModel(row, col);
                m.reset();
            }
        }
    }

    public asJSON(): string {
        return JSON.stringify(this.matrix);
    }

    public loadFromJSON(json: string) {
        const input = JSON.parse(json);
        for (const row of sudokuValues) {
            for (const col of sudokuValues) {
                const m = this.getModel(row, col);
                const cell = input[row - 1][col - 1];
                m.value = cell.value;
                m.predefined = cell.predefined;
            }
        }
    }
}

export class SudokuFieldModel {
    public value: SudokuValue | SudokuValue[];
    public predefined: boolean = false;
    public active: boolean = false;
    public highlighted: boolean = false;
    public error: boolean = false;

    constructor(
        public x: SudokuValue,
        public y: SudokuValue,
        public row: SudokuCollection,
        public col: SudokuCollection,
        public square: SudokuCollection,
    ) {
        this.value = sudokuValues.slice(0);
        row.set(y, this);
        col.set(x, this);
        // console.log(this);
        square.set(Sudoku.getIndexInSquare(x, y), this);
    }

    public reset() {
        this.value = sudokuValues.slice(0);
        this.predefined = false;
        this.active = false;
        this.highlighted = false;
        this.error = false;
    }

    public setValue(v: number) {
        if (v >= 1 && v <= 9) {
            this.value = v as SudokuValue;
        } else {
            console.error(`setValue(${v}) is not instanceof SudokuValue`);
        }
    }

    public removeDefinedValue() {
        this.value = sudokuValues.slice(0);
    }

    public hasDefinedValue(): SudokuValue | null {
        if (Sudoku.isSudokuValue(this.value)) {
            return this.value;
        } else {
            return null;
        }
    }

    /**
     * returns true, if this cell is either `val` or it containts `val` as possible value
     * @param {SudokuValue} val
     * @return {boolean}
     */
    public containsValue(val: SudokuValue): boolean {
        if (Sudoku.isSudokuValue(this.value)) {
            return this.value === val;
        }
        if (Sudoku.isSudokuValueList(this.value)) {
            return _.includes(this.value, val);
        }
        return false;
    }

    public hasEmptyPossibleValueList(): boolean {
        const v = this.value;
        return Sudoku.isSudokuValueList(v) && v.length === 0;
    }

    /**
     * also highlight cells in row / col / square
     */
    public setActive() {
        this.active = true;
        for (const i of sudokuValues) {
            this.row.get(i).setHighlighted();
            this.col.get(i).setHighlighted();
            this.square.get(i).setHighlighted();
        }
    }

    public setHighlighted() {
        this.highlighted = true;
    }

    public setInactive() {
        this.active = false;
        this.highlighted = false;
    }

    public toString(): string {
        const v = this.value;
        if (Sudoku.isSudokuValueList(v)) {
            return v.join(' ');
        }
        return v.toString();
    }

    /**
     * this is used by JSON.stringify to export only the public fields
     * @return {object}
     */
    public toJSON(): object {
        return {
            value: this.value,
            predefined: this.predefined,
        };
    }
}

export class SudokuCollection {
    public list: SudokuFieldModel[];

    constructor(public name: string, public index: number) {
        this.list = [];
    }

    public set(i: number /*SudokuValue*/, m: SudokuFieldModel) {
        this.list[i] = m;
    }

    public get(i: number /*SudokuValue*/) {
        return this.list[i];
    }

    /**
     * return an array that lists for each value the models with this value
     * @return {SudokuFieldModel[][]}
     */
    public getModelsByValue() {
        const counter: SudokuFieldModel[][] = [];
        for (const i of sudokuValues) {
            counter[i] = [];
        }
        for (const i of sudokuValues) {
            if (this.list[i]) {
                const v = this.list[i].hasDefinedValue();
                if (v) {
                    counter[v].push(this.list[i]);
                }
            }
        }
        return counter;
    }

    public countValues(counter: number[]) {
        for (const i of sudokuValues) {
            if (this.list[i]) {
                const v = this.list[i].hasDefinedValue();
                if (v) {
                    counter[v]++;
                }
            }
        }
    }

    public showErrors() {
        const counter = this.getModelsByValue();
        for (const i of sudokuValues) {
            if (counter[i].length > 1) {
                for (const m of counter[i]) {
                    m.error = true;
                }
            }
        }
    }
}
