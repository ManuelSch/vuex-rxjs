import Vue from "vue";
import {Observable, Subscription} from "rxjs";
import {BindTo} from "./$bindState";


declare module "vue/types/options" {
    interface ComponentOptions<V extends Vue> {
        __subs?: Subscription;
    }
}

declare module "vue/types/vue" {
    interface Vue {
        $bindState: <P>(from: Observable<P>) => BindTo<P>
    }
}
