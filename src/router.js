import VueRouter from 'vue-router'
import NewOrder from './views/NewOrder.vue'
import PayOrder from './views/PayOrder.vue'
import Start from './views/Start.vue'

export default new VueRouter({
    routes: [
        {
            path: '/',
            component: Start
        },
        {
            path: '/order',
            component: NewOrder
        },
        {
            path: '/pay',
            component: PayOrder
        }
    ]
})