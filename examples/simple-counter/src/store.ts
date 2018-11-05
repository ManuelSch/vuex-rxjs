import {Store} from "vuex-rxjs/dist/store";
import {sleep} from "@/util";


interface State {
    counter: number;
}


class SimpleStore extends Store<State> {

    /**
     * Mutation without input parameters:
     */
    public increment() {

        // the payload function never alters the state; instead, it returns a new state object:
        this.commit({
            type: 'INCREMENT_COUNTER',
            payload: state => ({
                ...state,
                counter: state.counter + 1
            })
        });
    }

    /**
     * Mutation with input parameters:
     */
    public setCounter(newCount: number) {
        this.commit({
            type: 'SET_COUNTER',
            payload: state => ({
                ...state,
                counter: newCount
            })
        });
    }

    /**
     * Async mutation:
     */
    public async resetIn(seconds: number) {

        // some asynchronous operation:
        await sleep(seconds * 1000);

        this.commit({
            type: 'RESET_COUNTER',
            payload: state => ({
                ...state,
                counter: 0
            })
        });
    }

    /**
     * Action (state-dependent call of a mutation)
     */
    public setToOddValue() {
        this.dispatch(async state => {

            // call a mutation dependent on the current state:
            if (state.counter % 2 == 0) {
                await this.increment();
            }

        });
    }

}


export const store = new SimpleStore({
    counter: 0
});
