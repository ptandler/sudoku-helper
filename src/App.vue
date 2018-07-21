<template>
    <div id="app">
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
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import SudokuField from './components/SudokuField';
    import {SudokuValue, sudokuValues, Sudoku} from './components/Sudoku';

    console.log(sudokuValues);

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
                    this.sudoku.setValueOfActiveCell(event.key)
                }
            }
        },
        data: () => {
            const sudoku = new Sudoku();

            const data = {
                sudoku,
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
