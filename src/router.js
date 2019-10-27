import VueRouter from 'vue-router'
import NewOrder from './views/NewOrder.vue'
import PayOrder from './views/PayOrder.vue'
import Start from './views/Start.vue'
import ProcessOrders from './views/ProcessOrders.vue'
import store from './store'

const router = new VueRouter({
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
            path: '/process',
            component: ProcessOrders
        },
        {
            path: '/pay',
            component: PayOrder
        }
    ],

})

router.beforeEach((to, from, next) => {
    console.log(store.user, store.selectedConcert)
    if (to.path == '/')  next()
    else if (store.user == null || store.selectedConcert == null) {
        console.log('redirect to /')
        next({path: '/', replace: true})
        alert('Bitte wähle ein Konzert aus')
    }
    else {
        next()
    }
}) 

export default router