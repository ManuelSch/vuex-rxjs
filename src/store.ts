import {first, map, publishReplay, refCount, scan, startWith, switchMap} from "rxjs/operators";
import {Observable, Subject} from "rxjs";
import {Action, IStore, Mutation} from "../types";
import {fromPromise} from "rxjs/internal-compatibility";
import {DevtoolsPlugin} from "./devtools";


export class Store<RootState> implements IStore<RootState> {

    private dispatchSubject = new Subject<Mutation<RootState>>();

    private _devtools = {
        mutationHookSubject: new Subject<{ mutation: Mutation<RootState>, newState: RootState }>()
    };

    public readonly state$: Observable<RootState> = this.dispatchSubject.pipe(
        scan((currentState: RootState, mutation: Mutation<RootState>) => {
            const newState = mutation.payload(currentState, currentState);
            this._devtools.mutationHookSubject.next({mutation, newState});
            return newState;
        }, this.initialState),
        startWith(this.initialState),
        publishReplay(1),
        refCount(),
    );

    constructor(
        public readonly initialState: RootState
    ) {
        DevtoolsPlugin.initialize<RootState>({
            subscribe: fn => this._devtools.mutationHookSubject.subscribe(({mutation, newState}) => fn(mutation, newState)),
            dispatch: mutation => this.commit(mutation),
            state: initialState
        });
    }

    public bind<PropType>(mapping: (state: Readonly<RootState>) => PropType): PropType {
        return this.state$.pipe(map((state: RootState) => mapping(state))) as unknown as PropType;
    }

    public commit(mutation: Mutation<RootState>): void {
        this.dispatchSubject.next(mutation);
    }

    public dispatch(action: Action<RootState>): Promise<void> {
        return this.state$.pipe(
            first(),
            switchMap((state: RootState) => fromPromise(action(state, state)))
        ).toPromise();
    }
}
