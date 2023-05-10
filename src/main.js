import Vue from 'vue'
import App from './App.vue'
import router from './rooter'  //自动扫描里面的路由配置

import {Header,Container,Row,Tag,Main} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Header);
Vue.use(Container);
Vue.use(Row);
Vue.use(Tag);
Vue.use(Main);

new Vue({
    router,
    render: h =>h(App)
}).$mount('#app')