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

    public rows: SudokuCollection[] = [];
    public cols: SudokuCollection[] = [];
    public squares: SudokuCollection[] = [];
    public matrix: SudokuFieldModel[][] = [];

    constructor() {
        // first init rows, cols and squares
        for (const i of sudokuValues) {
            this.rows.push(new SudokuCollection());
            this.cols.push(new SudokuCollection());
            this.squares.push(new SudokuCollection());
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
        for (let row of sudokuValues) {
            for (let col of sudokuValues) {
                this.getModel(row, col).setInactive();
            }
        }
    }

    public setActive(x: SudokuValue, y: SudokuValue) {
        this.clearActive();
        this.getModel(x, y).setActive();
    }

    public setValueOfActiveCell(v: string) {
        for (let row of sudokuValues) {
            for (let col of sudokuValues) {
                const m = this.getModel(row, col);
                if (m.active) {
                    m.setValue(parseInt(v, 10));
                }
            }
        }
    }
}

export class SudokuFieldModel {
    public value: SudokuValue | SudokuValue[];
    public active: boolean = false;
    public highlighted: boolean = false;
    public predefined: boolean = false;

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

    public setValue(v: number) {
        if (v >= 1 && v <= 9) {
            this.value = v as SudokuValue;
        } else {
            console.error(`setValue(${v}) is not instanceof SudokuValue`);
        }
    }

    public hasDefinedValue(): SudokuValue | null {
        if (this.value instanceof Array) {
            return null;
        } else {
            return this.value;
        }
    }

    /**
     * also highlight cells in row / col / square
     */
    public setActive() {
        this.active = true;
        for (let i of sudokuValues) {
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
        if (this.hasDefinedValue()) {
            return this.value.toString();
        } else {
            return "....";
        }
    }
}

export class SudokuCollection {
    public list: SudokuFieldModel[];

    constructor() {
        this.list = [];
    }

    public set(i: number /*SudokuValue*/, m: SudokuFieldModel) {
        this.list[i] = m;
    }

    public get(i: number /*SudokuValue*/) {
        return this.list[i];
    }
}
