<template>
    <b-collapse :id="id">
        <b-card>
            <p class="card-text">
                Sudoku-helper is a very simple tool that helps solving sudokus. You can e.g. use it for a game you are stuck with. Or you can solve the sudoku with <i>some</i> mouse clicks - which in fact might not really be exciting.
            </p>
            <p class="card-text">
                Use Keyboard to enter the values:<br/>
                <b>1 ... 9</b>: Change value of selected cell<br/>
                <b>0</b>: remove entered value of selected cell<br/>
                <b>d</b> or <b>*</b>: Mark cell as "predefined" (defined in the puzzle not inserted by yourself)
            </p>
            <p class="card-text">
                If you are stuck, you can use the helper functions to automatically apply some rules to get more values.
            </p>
        </b-card>
    </b-collapse>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    @Component
    export default class HelpText extends Vue {
        @Prop() private id!: string;
    }
</script>