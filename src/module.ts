import {combineLatest, Observable} from "rxjs";
import {distinctUntilChanged, first, map, publishReplay, refCount, switchMap} from "rxjs/operators";
import {Action, IStore, Mutation} from "../types";
import {fromPromise} from "rxjs/internal-compatibility";


export class Module<ModuleState, RootState> implements IStore<ModuleState, RootState> {

    public readonly state$: Observable<ModuleState> =
        this.parentStore.state$.pipe(
            map(rootState => this.stateMap(rootState)),
            distinctUntilChanged(),
            publishReplay(1),
            refCount()
        );

    constructor(
        private parentStore: IStore<RootState>,
        private stateMap: (state: RootState) => ModuleState,
        private dispatchMap: (moduleState: ModuleState, rootState: RootState) => void
    ) {

    }

    public bind<PropType>(mapping: (state: ModuleState) => PropType): PropType {
        return this.state$.pipe(map((state: ModuleState) => mapping(state))) as unknown as PropType;
    }

    public commit(mutation: Mutation<ModuleState, RootState>): void {
        this.parentStore.commit({
            type: mutation.type,
            payload: (rootState: RootState) => {
                this.dispatchMap(
                    mutation.payload(
                        this.stateMap(rootState),
                        rootState),
                    rootState
                );
                return rootState;
            }
        });
    }

    public async dispatch(action: Action<ModuleState, RootState>): Promise<void> {
        return combineLatest(this.state$, this.parentStore.state$).pipe(
            first(),
            switchMap(([state, rootState]: [ModuleState, RootState]) => fromPromise(action(state, rootState)))
        ).toPromise();
    }


}

