# vuex-rxjs

State management for [Vue](https://github.com/vuejs/vue):
* Compatible with [Vue Devtools](https://github.com/vuejs/vue-devtools)
* Type-safe mutations
* Reactive approach (based on [RxJS](https://github.com/ReactiveX/rxjs))
* Inspired by [Vuex](https://github.com/vuejs/vuex) 



### Installation

_Install RxJS as a peer dependency:_ `npm install rxjs --save`

```sh
npm install vuex-rxjs --save
```
```sh
yarn add vuex-rxjs
```


### Usage

**main.ts:**
```js
import {VuexRxJS} from "vuex-rxjs";

VuexRxJS(Vue);  // Install VuexRxJS

new Vue({
    render: h => h(App),
}).$mount('#app')
```


**store.ts:**
```js
/**
 * Define the state:
 */
class State {
    counter: number = 0;    // initial value for counter
}
```

```js
import {Store} from "vuex-rxjs/dist/store";

/**
 * Define your store:
 */
class SimpleStore extends Store<State> {

    /**
     * Mutation:
     */
    increment() {
        this.commit({
            type: 'INCREMENT_COUNTER',
            payload: state => ({
                counter: state.counter + 1
            })
        });
        
        // NOTE: the payload function never alters the state;
        // instead, it returns a new state object
    }
}

/**
 * Instatiate your store and export it:
 */
export const store = new SimpleStore(new State());  // Initial state is defined here
```

**Component.vue:**
```html
<template>
    <div id="app">
        <p>Count: {{count}}</p>
        <button @click="addOne()">Add 1</button>
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
        count: number = store.bind(state => state.counter);

        /**
         * Call a store method:
         */
        addOne() {
            store.increment();
        }
    }
</script>
```


### Examples
* [Counter](https://github.com/ManuelSch/vuex-rxjs/tree/master/examples/simple-counter)

### Todo
* Complete the Readme (Usage)
* Add module example
* Add tests
