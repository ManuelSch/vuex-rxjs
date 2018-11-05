<template>
    <div id="app">
        <p>Count: {{count}}</p>
        <button @click="addOne()">Add 1</button>
        <button @click="reset()">Reset</button>
        <button @click="resetAsync()">Reset in 1 second... (async)</button>
        <button @click="changeToOdd()">Change to closest odd value</button>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {store} from "./store";

    @Component
    export default class App extends Vue {

        /**
         * Bind a state property to a component property:
         */
        public count: number = store.bind(state => state.counter);


        public addOne() {
            store.increment();
        }

        public reset() {
            store.setCounter(0);
        }

        public changeToOdd() {
            store.setToOddValue();
        }

        public resetAsync() {
            store.resetIn(1);
        }

    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
    }

    #app > * {
        display: block;
        margin: 20px auto;
        text-align: center;
    }
</style>
