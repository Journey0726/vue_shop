import Vue from 'vue'
import VueRouter from 'vue-router'
const LogIn = ()=>import('../components/login.vue')
const Home = ()=>import( '@/components/home.vue')
const Welcome = ()=>import( '@/components/welcome.vue')
const Users = ()=>import( '@/components/users/users.vue')
const Right = ()=>import( '@/components/powers/rights.vue')
const Roles = ()=>import( '@/components/powers/roles.vue')
const Categories = ()=>import( '@/components/goods/categories.vue')
const Params = ()=>import( '@/components/goods/params.vue')
const GoodsList = ()=>import( '@/components/goods/goodsList')
const AddGood = ()=>import( '@/components/goods/addGood.vue')
const Order = ()=>import( '@/components/order/order.vue')
const Report = ()=>import( '@/components/reports/report.vue')
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
     },
     {
       path:'/rights',
       component:Right
     },
     {
       path:'/roles',
       component:Roles
     },
     {
      path:'/categories',
      component:Categories
    },
    {
      path:'/params',
      component:Params
    },
    {
      path:'/goods',
      component:GoodsList,
    },
    {
      path:'/goods/add',
      component:AddGood
    },
    {
      path:'/orders',
      component:Order
    },
    {
      path:'/reports',
      component:Report
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
