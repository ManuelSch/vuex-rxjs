import {Subscription} from "rxjs";

export const mixin: any = {
    created() {
        this.$options.__subs && this.$options.__subs.unsubscribe();
        this.$options.__subs = new Subscription();
    },

    beforeDestroy() {
        this.$options.__subs && this.$options.__subs.unsubscribe();
    }
};
