import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import router from "./router/index.js";
import './assets/fonts/iconfont.css'

import Npro from 'nprogress'
import 'nprogress/nprogress.css'
import axios from 'axios'


//导入全局样式表
import './assets/css/global.css'



//请求配置的根路径
// axios.defaults.baseURL = 'http://192.168.1.122:8888/api/private/v1/'
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'

//设置请求拦截器
axios.interceptors.request.use(config =>{
    Npro.start()
    config.headers.Authorization = window.sessionStorage.getItem('token');
    //在最后必须return
    return config
})

//设置响应拦截器
axios.interceptors.response.use(config =>{
    Npro.done();
    return config
})

const  app =createApp(App)
app.use(ElementPlus)
app.use(router)


// app.use(axios)
app.config.globalProperties.$http = axios;
// app.use(TreeTable)
app.config.globalProperties.$filters = {
    dateFormat(orginVal){
        const dt = new Date(orginVal)
        const y = dt.getFullYear()
        const m = (dt.getMonth() + 1 + '').padStart(2,'0')
        const d = (dt.getDate() + '').padStart(2,'0')

        const hh =(dt.getHours() + '').padStart(2,'0')
        const mm = (dt.getMinutes() + '').padStart(2,'0')
        const ss =(dt.getSeconds() + '').padStart(2,'0')
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }
}



app.mount('#app')

