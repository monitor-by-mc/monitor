import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Monitor',
    component: () => import(/* webpackChunkName: "monitor" */ '../views/monitor/index.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
