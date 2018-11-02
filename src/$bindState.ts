import {Observable} from "rxjs";
import {Vue} from "vue/types/vue";
import {BindTo} from "../types";

export function $bindState<State>(this: Vue, from: Observable<State>): BindTo<State> {
    const to: BindTo<State> = {
        to: (mapping: (val: State) => void) => {
            if ((this.$options as any).__subs) {
                (this.$options as any).__subs.add(from.subscribe((val: State) => mapping(val)));
            }
            return to;
        }
    };
    return to;
}
