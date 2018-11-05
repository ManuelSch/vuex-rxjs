import Vue from 'vue'
import App from './App.vue'
import {VuexRxJS} from "vuex-rxjs";

Vue.config.productionTip = false;

/**
 * Install VuexRxJS before calling new Vue({...}):
 */
VuexRxJS(Vue);

new Vue({
    render: h => h(App),
}).$mount('#app')
