import {Sudoku, SudokuCollection, SudokuFieldModel, SudokuValue, sudokuValues} from '@/components/Sudoku';
import * as _ from 'lodash';

export default class SudokuHelper {
    constructor(public sudoku: Sudoku) {
    }

    /**
     * update the list of possible valid values
     * for all cells that do not have a defined value
     */
    public updatePossibleValues() {
        this.sudoku.clearActive();
        for (const row of sudokuValues) {
            for (const col of sudokuValues) {
                const m = this.sudoku.getModel(row, col);
                if (!m.hasDefinedValue()) {
                    const counter = this.getValueCountsFor(m);
                    const values = [];
                    for (const i of sudokuValues) {
                        if (counter[i] === 0) {
                            values.push(i);
                        }
                    }
                    if (!_.isEqual(m.value, values) ) {
                        m.value = values as SudokuValue[];
                        m.setHighlighted();
                    }
                }
            }
        }
    }

    // noinspection JSMethodCanBeStatic
    public getValueCountsFor(m: SudokuFieldModel) {
        const counter = [];
        for (const i of sudokuValues) {
            counter[i] = 0;
        }
        m.row.countValues(counter);
        m.col.countValues(counter);
        m.square.countValues(counter);
        return counter;
    }

    public assignAllCellsWithSinglePossibleValue() {
        this.sudoku.clearActive(); // changed cell will be highlighted
        for (const row of sudokuValues) {
            for (const col of sudokuValues) {
                const m = this.sudoku.getModel(row, col);
                const val = m.value;
                if (Sudoku.isSudokuValueList(val) && val.length === 1) {
                    // there's only one possible vales detected here, use this
                    m.setValue(val[0]);
                    m.setHighlighted();
                }
            }
        }
    }

    public assignAllSinglePossibleValueInCollections() {
        this.sudoku.clearActive(); // changed cell will be highlighted
        this.assignAllSinglePossibleValueInCollection(this.sudoku.rows);
        this.assignAllSinglePossibleValueInCollection(this.sudoku.cols);
        this.assignAllSinglePossibleValueInCollection(this.sudoku.squares);
    }

    // noinspection JSMethodCanBeStatic
    public assignAllSinglePossibleValueInCollection(collections: SudokuCollection[]) {
        for (const c of collections) {
            // check this collection if the position of each value can be uniquely identified
            for (const value of sudokuValues) {
                const positionsOfValue = [];
                for (const i of sudokuValues) {
                    const m = c.get(i);
                    if (m.containsValue(value)) {
                        positionsOfValue.push(m);
                    }
                }
                // check if there is only one possible position of this value
                if (positionsOfValue.length === 1) {
                    const m = positionsOfValue[0];
                    if (!m.hasDefinedValue()) {
                        m.setValue(value);
                        m.setHighlighted();
                    }
                }
            }
        }
    }
}
