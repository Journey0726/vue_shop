import Vue from 'vue'
import VueRouter from 'vue-router'
import LogIn from '../components/login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    redirect:'login'
  },
  {
    path:'/login',
    component:LogIn
  }

]

const router = new VueRouter({
  routes
})

export default router
