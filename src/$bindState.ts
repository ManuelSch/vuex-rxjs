import {IStore} from "../types";
import {map} from "rxjs/operators";

export function $bindState<State, PropType>(store: IStore<State, any>, mapping: (state: State) => PropType): PropType {
    return store.state$.pipe(map(state => mapping(state))) as unknown as PropType;
}
