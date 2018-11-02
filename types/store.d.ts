import {Observable} from "rxjs";


export interface IStore<State, RootState = State> {
    readonly state$: Observable<State>;

    commit(mutation: Mutation<State, RootState>): void;

    dispatch(action: Action<State, RootState>): Promise<void>;
}

export interface Mutation<State, RootState = State> {
    type: string;
    payload: Payload<State, RootState>;
}

export type Payload<State, RootState = State> = (state: State, rootState: RootState) => State;

export type Action<State, RootState = State> = (state: State, rootState: RootState) => Promise<void>
