import Vue from 'vue'
import VueRouter from 'vue-router'
import LogIn from '../components/login.vue'
import Home from '@/components/home.vue'
import Welcome from '@/components/welcome.vue'
import Users from '@/components/users/users.vue'
Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    redirect:'login'
  },
  {
    path:'/login',
    component:LogIn
  },
  {
    path:'/home',
    component:Home,
    redirect:'/welcome',
    children:[
     {
       path:'/welcome',
       component:Welcome
     },
     {
       path:'/users',
       component:Users
     }
    ]
  }

]

const router = new VueRouter({
  routes,
  mode:'history'
})
router.beforeEach((to,from,next)=>{
  if(to.path === '/login') return next()
  const tokenStr=window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next()
})

export default router
