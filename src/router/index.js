import { createRouter, createWebHashHistory } from 'vue-router'

import Login from '../views/login.vue'
import Home from '../views/home.vue'
import Dashboard from '../views/dashboard.vue'
import Table from '../views/table.vue'
import Tabs from '../views/tabs.vue'


const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        { path: '/', redirect: '/login', },
        { path: '/login', component: Login },
        {
            path: '/home', component: Home, children: [
                { path: 'dashboard', component: Dashboard },
                { path: 'table', component: Table },
                { path: 'table/:id', component: Tabs, props: true }
            ]
        }
    ],

})

// 导航守卫
router.beforeEach((to, from, next) => {
    const tokenStr = localStorage.getItem('token')
    if (to.path === '/home' && !tokenStr) {
        // 访问后台主页

        next('/login')
    } else {
        next()
    }
})

export default router