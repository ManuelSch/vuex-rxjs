import Vue from "vue";
import {Subscription} from "rxjs";
import {IStore} from "./store";


declare module "vue/types/options" {
    interface ComponentOptions<V extends Vue> {
        __subs?: Subscription;
    }
}

declare module "vue/types/vue" {
    interface Vue {
        $bindState: <State, PropType>(store: IStore<State, any>, mapping: (state: State) => PropType) => PropType
    }
}
