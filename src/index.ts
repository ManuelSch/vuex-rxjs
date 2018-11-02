import {Store} from "./store";
import {Module} from "./module";
import {mixin} from "./mixin";


export default {
    Store: Store,
    Module: Module
}

export function VuexRxJS(Vue: any) {
    Vue.mixin(mixin);
}
