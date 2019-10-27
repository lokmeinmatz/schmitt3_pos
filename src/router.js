import VueRouter from 'vue-router'
import NewOrder from './views/NewOrder.vue'

export default new VueRouter({
    routes: [
        {
            path: '/',
            component: NewOrder
        }
    ]
})