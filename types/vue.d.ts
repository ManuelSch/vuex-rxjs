import Vue from "vue";
import {Subscription} from "rxjs";


declare module "vue/types/options" {
    interface ComponentOptions<V extends Vue> {
        __subs?: Subscription;
    }
}
