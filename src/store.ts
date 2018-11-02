import {first, publishReplay, refCount, scan, startWith, switchMap, throttleTime} from "rxjs/operators";
import {Observable, Subject} from "rxjs";
import {Action, IStore, Mutation} from "../types";
import {fromPromise} from "rxjs/internal-compatibility";


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
        throttleTime(1),
        publishReplay(1),
        refCount(),
    );

    constructor(
        public readonly initialState: RootState
    ) {

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
