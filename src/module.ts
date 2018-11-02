import {combineLatest, Observable} from "rxjs";
import {distinctUntilChanged, first, map, publishReplay, refCount, switchMap} from "rxjs/operators";
import {Action, IStore, Mutation} from "../types";
import {fromPromise} from "rxjs/internal-compatibility";


export class Module<ModuleState, ParentState> implements IStore<ModuleState, ParentState> {

    public readonly state$: Observable<ModuleState> =
        this.parentStore.state$.pipe(
            map(rootState => this.stateMap(rootState)),
            distinctUntilChanged(),
            publishReplay(1),
            refCount()
        );

    constructor(
        private parentStore: IStore<ParentState>,
        private stateMap: (state: ParentState) => ModuleState,
        private dispatchMap: (moduleState: ModuleState, rootState: ParentState) => void
    ) {

    }

    public commit(mutation: Mutation<ModuleState, ParentState>): void {
        this.parentStore.commit({
            type: mutation.type,
            payload: (rootState: ParentState) => {
                const newState: ParentState = Object.assign({}, rootState);
                this.dispatchMap(
                    mutation.payload(
                        this.stateMap(newState),
                        newState),
                    newState
                );
                return newState;
            }
        });
    }

    public async dispatch(action: Action<ModuleState, ParentState>): Promise<void> {
        return combineLatest(this.state$, this.parentStore.state$).pipe(
            first(),
            switchMap(([state, rootState]: [ModuleState, ParentState]) => fromPromise(action(state, rootState)))
        ).toPromise();
    }

}

