<template>
    <div id="app" class="container">
        <div class="row">
            <div class="col-12 text-center">
                <h1>The Stupid Simple Sudoku Helper</h1>
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
                        <td class="remainingField" style="width: 5px"></td>
                        <td class="field remainingField">
                            {{ sudoku.getRow(row).getUnassignedValuesInCollection().join(" ") }}
                        </td>
                    </tr>
                    <tr style="height=5ox"></tr>
                    <tr>
                        <td class="field remainingField"
                            v-for="col in values" :key="col">
                            {{ sudoku.getCol(col).getUnassignedValuesInCollection().join(" ") }}
                        </td>
                    </tr>
                </table>
                <br/>
                <b-button-toolbar>
                    <b-button-group>
                        <b-button v-b-toggle.help v-b-tooltip title="Show some help, e.g. keyboard usage">?</b-button>
                        <br/>
                        <b-button @click="saveGame" v-b-tooltip title="Save the current status to the browser's local storage">Save</b-button>
                        <b-button @click="loadGame" v-b-tooltip title="Load the last saved game status from the browser's local storage">Load</b-button>
                    </b-button-group>
                    <b-button-group>
                        <!--<b-button @click="showJSON" v-if="!exportedJSON">Show as JSON</b-button>-->
                        <!--<b-button @click="hideJSON" v-else>Hide JSON</b-button>-->
                        <b-button @click="restartGame" v-b-tooltip title="Reset all values entered by you (not marked as 'predefined'">Restart</b-button>
                        <b-button @click="clearGame" v-b-tooltip title="Remove everything, also predefined values">Clear</b-button>
                    </b-button-group>
                </b-button-toolbar>
                <HelpText id="help"/>
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
    /* tslint:disable:no-console */
    import {Component, Vue} from 'vue-property-decorator';
    import SudokuField from './components/SudokuField.vue';
    import {SudokuValue, sudokuValues, Sudoku} from './components/Sudoku';
    import SudokuHelper from './components/SudokuHelper';
    import HelpText from './components/HelpText.vue';

    @Component({
        components: {
            SudokuField, HelpText,
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

        public onKeypress(event: any) {
            // use `any` as param type here, as I have no idea if there is a KeyboardEvent type predefined somewhere ...
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
            if (event.key === 'd' || event.key === '*') {
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
            this.sudoku.clearActive();
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

        public clearGame() {
            this.sudoku.reset();
        }

        public restartGame() {
            this.sudoku.restart();
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
        font-family: 'PT Sans', Helvetica, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
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

        .remainingField {
            border: none;
            font-size: xx-small;
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
