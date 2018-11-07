import {Observable, Subscription} from "rxjs";

export const mixin: any = {
    created() {
        this.$options.__subs && this.$options.__subs.unsubscribe();
        this.$options.__subs = new Subscription();

        Object.keys(this.$data).forEach(key => {
            const prop: any = (this as any)[key];

            // if property has been declared as an Observable -> subscribe to it:
            if (prop instanceof Observable && prop.subscribe) {
                (this as any)[key] = null;
                this.$options.__subs.add(
                    prop.subscribe(state => (this as any)[key] = state)
                );
            }
        });
    },

    beforeDestroy() {
        this.$options.__subs && this.$options.__subs.unsubscribe();
    }
};
