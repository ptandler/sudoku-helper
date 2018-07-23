<template>
    <div id="app" class="container">
        <div class="row">
            <div class="col-12">
                <h1>Sudoku for Dummies</h1>
                <p class="text-info">Get help to solve your Sudoku!</p>
            </div>
        </div>
        <div class="row">
            <div class="col-12 col-md-9">
                <table class="sudoku"
                       tabindex="1"
                       @keypress="onKeypress">
                    <tr v-for="row in values" :key="row">
                        <SudokuField
                                v-for="col in values" :key="col"
                                :model="getModel(row, col)"
                                v-on:clearActive="clearActive()"
                        />
                    </tr>
                </table>
                <br/>
                <b-button-toolbar>
                    <b-button-group>
                        <b-button v-b-toggle.help>?</b-button>
                        <br/>
                        <b-button @click="saveGame">Save to Local Storage</b-button>
                        <b-button @click="loadGame">Load from Local Storage</b-button>
                    </b-button-group>
                    <b-button-group>
                        <b-button @click="showJSON" v-if="!exportedJSON">Show as JSON</b-button>
                        <b-button @click="hideJSON" v-else>Hide JSON</b-button>
                        <b-button @click="resetGame">Clear</b-button>
                    </b-button-group>
                </b-button-toolbar>
                <b-collapse id="help">
                    <b-card>
                        <p class="card-text text-left">
                            Keyboard:<br/>
                            1 ... 9: Change value of selected cell<br/>
                            0: remove entered value of selected cell<br/>
                            d: Mark cell as "predefined" (defined in the puzzle not by user)
                        </p>
                    </b-card>
                </b-collapse>
            </div>
            <div class="col-12 col-md-3">
                <b-button-toolbar>
                    <b-button-group vertical>
                        <b-button @click="showErrors">Show Errors</b-button>
                        <b-button @click="updatePossibleValues">Update Possible Values</b-button>
                        <b-button @click="assignAllCellsWithSinglePossibleValue">Assign all Cells with Single Possible
                            Value
                        </b-button>
                        <b-button @click="assignAllSinglePossibleValueInCollections">Assign Cells that have a Single
                            Possible Value in all collections
                        </b-button>
                    </b-button-group>
                </b-button-toolbar>
            </div>
            <!-- export -->
            <div class="col-12" v-if="exportedJSON">
                {{ exportedJSON }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import SudokuField from './components/SudokuField';
    import {SudokuValue, sudokuValues, Sudoku} from './components/Sudoku';
    import SudokuHelper from './components/SudokuHelper';

    @Component({
        components: {
            SudokuField,
        },
    })
    export default class App extends Vue {
        protected sudoku = new Sudoku();
        protected helper = new SudokuHelper(this.sudoku);
        protected exportedJSON: string | null = null;
        // noinspection JSUnusedGlobalSymbols
        protected values = sudokuValues;

        constructor() {
            super();
            console.log(this);
        }

        public getModel(x: SudokuValue, y: SudokuValue) {
            return this.sudoku.getModel(x, y);
        }

        public clearActive() {
            this.sudoku.clearActive();
        }

        public onKeypress(event) {
            // console.log(event);
            if (event.key >= '1' && event.key <= '9') {
                this.sudoku.hideErrors(); // this is no longer valid
                this.sudoku.setValueOfActiveCell(event.key);
                return;
            }
            if (event.key === '0') {
                this.sudoku.hideErrors(); // this is no longer valid
                for (const m of this.sudoku.getActiveCells()) {
                    m.removeDefinedValue();
                }
            }
            if (event.key === 'd') {
                for (const m of this.sudoku.getActiveCells()) {
                    m.predefined = !m.predefined;
                }
                return;
            }
        }

        // helper functions
        public showErrors() {
            this.sudoku.showErrors();
        }

        public updatePossibleValues() {
            this.helper.updatePossibleValues();
        }

        public assignAllCellsWithSinglePossibleValue() {
            this.helper.assignAllCellsWithSinglePossibleValue();
        }

        public assignAllSinglePossibleValueInCollections() {
            this.helper.assignAllSinglePossibleValueInCollections();
        }

        // organization functions
        public saveGame() {
            const json = this.sudoku.asJSON();
            localStorage.setItem('currentGame', json);
        }

        public loadGame() {
            try {
                const json = localStorage.getItem('currentGame');
                if (json) {
                    this.sudoku.clearActive();
                    this.sudoku.loadFromJSON(json);
                }
            } catch (e) {
                console.error(e);
            }
        }

        public resetGame() {
            this.sudoku.reset();
        }

        public showJSON() {
            this.exportedJSON = this.sudoku.asJSON();
        }

        public hideJSON() {
            this.exportedJSON = null;
        }
    }
</script>

<style lang="scss">
    @import url('https://fonts.googleapis.com/css?family=PT+Sans');

    #app {
        font-family: 'PT Sans', 'Droid Sans', Helvetica, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }

    table.sudoku {
        border-spacing: 0;
        border-collapse: collapse;

        td {
            border: 1px solid gray;
            padding: 3px;
            width: 50px;
            height: 50px;
        }

        // make the bold lines for squares
        td:first-child {
            border-left-width: 3px;
        }
        td:nth-child(3n) {
            border-right-width: 3px;
        }
        tr:first-child td {
            border-top-width: 3px;
        }
        tr:nth-child(3n) td {
            border-bottom-width: 3px;
        }
    }

    button {
        margin: 5px !important; // todo I thought bootstrap has a default margin for buttons ...?
    }

    // format of the vertial toolbar for rules
    .btn-group-vertical {
        button {
            white-space: normal;
        }
    }
</style>
