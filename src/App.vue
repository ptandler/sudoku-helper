<template>
    <div id="app" class="container">
        <div class="row">
            <div class="col-12 col-lg-8">
                <h1>Sudoku Helper :-)</h1>
                <table class="sudoku"
                       tabindex="1"
                       @keypress="onKeypress">
                    <tr v-for="row in values">
                        <SudokuField
                                v-for="col in values"
                                :model="getModel(row, col)"
                                v-on:clearActive="clearActive()"
                        />
                    </tr>
                </table>
            </div>
            <div class="col-12 col-lg-4">
                <br/>
                <b-button @click="toggleHelp">?</b-button>
                <b-button @click="showErrors">Show Errors</b-button>
                <br/>
                <b-button @click="saveGame">Save to Local Storage</b-button>
                <b-button @click="loadGame">Load from Local Storage</b-button>
                <b-button @click="showJSON" v-if="!exportedJSON">Show as JSON</b-button><b-button @click="hideJSON" v-if="exportedJSON">Hide JSON</b-button>
            </div>
            <!-- export -->
            <div class="col-12" v-if="exportedJSON">
                {{ exportedJSON }}
            </div>
            <!-- help text -->
            <div class="col-12" v-if="showHelp">
                <br/>
                <p class="text-left">
                    Keys:<br/>
                    1 ... 9: Change value of selected cell<br/>
                    0: remove entered value of selected cell<br/>
                    d: Mark cell as "predefined" (defined in the puzzle not by user)
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import SudokuField from './components/SudokuField';
    import {SudokuValue, sudokuValues, Sudoku} from './components/Sudoku';

    @Component({
        components: {
            SudokuField,
        },
        methods: {
            getModel(x: SudokuValue, y: SudokuValue) {
                return this.sudoku.getModel(x, y);
            },
            clearActive() {
                this.sudoku.clearActive();
            },
            onKeypress(event) {
                // console.log(event);
                if (event.key >= "1" && event.key <= "9") {
                    this.hideErrors(); // this is no longer valid
                    this.sudoku.setValueOfActiveCell(event.key);
                    return;
                }
                if (event.key == "0") {
                    this.hideErrors(); // this is no longer valid
                    for (let m of this.sudoku.getActiveCells()) {
                        m.removeDefinedValue();
                    }
                }
                if (event.key === "d") {
                    for (let m of this.sudoku.getActiveCells()) {
                        m.predefined = !m.predefined;
                    }
                    return;
                }
            },
            showErrors() {
                this.sudoku.showErrors();
            },

            saveGame() {
                const json = this.sudoku.asJSON();
                localStorage.setItem('currentGame', json);
            },

            loadGame() {
                try {
                    const json = localStorage.getItem('currentGame');
                    if (json) {
                        this.sudoku.loadFromJSON(json);
                    }
                } catch (e) {
                    console.error(e);
                }
            },

            showJSON() {
                this.exportedJSON = this.sudoku.asJSON();
            },
            hideJSON() {
                this.exportedJSON = null;
            },

            toggleHelp() {
                this.showHelp = !this.showHelp;
            }
        },
        data: () => {
            const sudoku = new Sudoku();

            const data = {
                sudoku,
                showHelp: false,
                exportedJSON: null,
                values: sudokuValues
            };
            console.log(data);
            return data;
        },
    })
    export default class App extends Vue {
    }
</script>

<style lang="scss">
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
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
            width: 6ex;
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
</style>
