 //1.引入
import { createRouter , createWebHashHistory } from 'vue-router'
 import login from "../components/Login.vue";
import Home from "../components/Home.vue";
import Welcome from "../components/Welcome.vue";
import Users from "../components/user/Users.vue";
import Rights from "../components/power/Rights.vue";
import Roles from "../components/power/Roles.vue";
import Cate from "../components/goods/Cate.vue";
import Params from "../components/goods/Params.vue";
import GoodList from "../components/goods/List.vue";
import Add from "../components/goods/Add.vue";
import Order from "../components/order/Order.vue";
import Report from "../components/report/Report.vue";



//2.创建路由对象
const routes = [
    {path: '/' , redirect:'/login'},
    {path: '/login' , component:login },
    {
        path: '/home' ,
        component:Home ,
        redirect: '/welcome',
        children: [
            {path: '/welcome',component:Welcome},
            {path: '/users' , component: Users},
            {path: '/rights' , component: Rights},
            {path: '/roles' , component: Roles},
            {path: '/categories' , component: Cate},
            {path: '/params' , component: Params},
            {path: '/goods' , component: GoodList},
            {path: '/goods/add' , component: Add},
            {path: '/orders' , component: Order},
            {path: '/reports' , component: Report},

        ]},

]


const router = createRouter({
    history:createWebHashHistory(),
    routes
})

 //路由导航守卫
 router.beforeEach((to,from,next)=>{
        if(to.path === '/login') return next();
        //获取token
        const tokenStr = window.sessionStorage.getItem('token');
        if (!tokenStr) return next('/login');
        next()
 })

//3.导出路由对象
export default router
