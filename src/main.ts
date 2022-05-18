import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import axios from "axios";
import {ErrCode} from "@/model";
import store from './store'

axios.defaults.baseURL = '/api';
axios.defaults.withCredentials = true;

//配置axios拦截器
axios.interceptors.response.use((response) => {
    //配置用户未登录的处理
    if (response.config.url != '/user/userInfo') {
        const errCode = response.data && response.data.errCode;
        if (errCode == ErrCode.NO_LOGIN) {
            const path = router.currentRoute.value.path;
            if (path != '/login')
                router.push('/login?path=' + router.currentRoute.value.path);
        }
    }
    return response;
});

createApp(App).use(store).use(router).mount('#app')
