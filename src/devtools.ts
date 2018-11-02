import {Mutation} from "../types";

export interface DevtoolsStore<RootState> {
    state: RootState;

    subscribe(fn: (mutation: Mutation<RootState, RootState>, state: RootState) => void): void;

    dispatch(mutation: Mutation<RootState, RootState>): void;
}

function replaceStateMutation<RootState>(newState: RootState): Mutation<RootState, RootState> {
    return {
        type: '__vue_devtools_REPLACE_STATE',
        payload: () => Object.assign({}, newState)
    };
}

export const DevtoolsPlugin = {
    initialize<RootState>(store: DevtoolsStore<RootState>) {
        const devtoolHook = typeof window !== 'undefined' && (window as any)['__VUE_DEVTOOLS_GLOBAL_HOOK__'];

        if (!devtoolHook) {
            return;
        }

        devtoolHook.emit('vuex:init', store);

        devtoolHook.on('vuex:travel-to-state', (targetState: any) => {
            store.dispatch(replaceStateMutation(targetState));
            store.state = targetState;
        });

        store.subscribe((mutation: Mutation<RootState, RootState>, newState: RootState) => {
            store.state = newState;
            if (mutation.type !== replaceStateMutation(null).type) {
                devtoolHook.emit('vuex:mutation', mutation, newState);
            }
        });
    }
};
