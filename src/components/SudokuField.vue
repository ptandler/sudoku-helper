<template>
    <td :class="{ field: true,
        active: model.active,
        highlighted: model.highlighted,
        error: model.error || model.hasEmptyPossibleValueList(),
        predefined: model.predefined,
        defined: model.hasDefinedValue(),
        notDefined: ! model.hasDefinedValue()
        }"
        v-on:click="activate"
    >
        {{ model.toString() }}
    </td>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {SudokuFieldModel} from './Sudoku';

    @Component
    export default class SudokuField extends Vue {
        @Prop() private model: SudokuFieldModel;

        public activate() {
            this.$emit('clearActive');
            this.model.setActive();
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .active {
        background: yellow !important;
    }
    .highlighted {
        background: lightyellow;
    }
    .error {
        color: red;
        // text-decoration: underline red;
        border: 3px solid red;
    }
    .predefined {
        font-size: large;
        // font-weight: bold;
        background: lighten(lightgray, 12%);
    }
    .defined {
        font-weight: bold;
    }
    .notDefined {
        font-size: xx-small;
    }
</style>
