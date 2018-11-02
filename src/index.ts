import {Store} from "./store";
import {Module} from "./module";
import {mixin} from "./mixin";
import {$bindState} from "./$bindState";


export default {
    Store: Store,
    Module: Module
}

export function VuexRxJS(Vue: any) {
    Vue.mixin(mixin);
    Vue.prototype.$bindState = $bindState;
}
