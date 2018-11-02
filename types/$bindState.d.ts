export type BindTo<State> = ({
    to: (mapping: (val: State) => void) => BindTo<State>
});
