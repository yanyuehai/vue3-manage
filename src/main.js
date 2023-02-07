import { createApp } from 'vue'
import App from './App.vue'

// ElLoading 加载效果
import { ElLoading } from 'element-plus'

const app = createApp(App)

// 配置ElementPlus组件库
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
app.use(ElementPlus)


// 声明icon图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

  // 配置axios
import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:8080'
// axios.defaults.baseURL = 'https://www.escook.cn'
app.config.globalProperties.$http = axios


// 声明请求拦截器
let loadingInstance = null 
axios.interceptors.request.use((config) => {
    // 展示 ElLoading 效果
    loadingInstance = ElLoading.service({ fullscreen:true })
    return config
})

// 声明响应拦截器
axios.interceptors.response.use((response) => {
    // 隐藏 ElLoading 效果
    loadingInstance.close()
    return response
})

// 配置路由
import router from './router/index'
app.use(router)

app.mount('#app')
