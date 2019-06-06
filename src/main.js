import Vue from 'vue'
import App from './App.vue'
import VueRoute from 'vue-router'

Vue.config.productionTip = false
Vue.use(VueRoute)

const router = new VueRoute({
    routes: [
        {path: '/', component: () => import('./components/Algorithm.vue')}
    ]
})

new Vue({
    router,
    render: h => h(App),
}).$mount('#app')
