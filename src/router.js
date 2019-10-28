import VueRouter from 'vue-router'
import Start from './views/Start.vue'
import store from './store'

const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            component: Start
        },
        {
            path: '/order',
            component: () => import('./views/NewOrder.vue')
        },
        {
            path: '/process',
            component: () => import('./views/ProcessOrders.vue')
        },
        {
            path: '/stats',
            component: () => import('./views/Stats.vue')
        },
        {
            path: '/pay',
            component: () => import('./views/PayOrder.vue')
        }
    ],

})

router.beforeEach((to, from, next) => {
    if (to.path == '/')  next()
    else if (store.user == null || store.selectedConcert == null) {
        // eslint-disable-next-line
        console.log('redirect to /')
        next({path: '/', replace: true})
        alert('Bitte wähle ein Konzert aus')
    }
    else {
        next()
    }
}) 

export default router