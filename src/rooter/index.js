import Vue from "vue";
import VueRouter from "vue-router";

import ChooseCar from "../components/chooseCar";
import Raycaster from "../components/raycaster";

//安装路由
Vue.use(VueRouter);
//配置导出路由
export default new VueRouter({
  routes:[
    {
      //路由路径
      path:'/chooseCar',
      name:'chooseCar',
      //跳转的组件
      component:ChooseCar
    },
    
    {
      //路由路径
      path:'/raycaster',
      name:'raycaster',
      //跳转的组件
      component:Raycaster
    },
    
  ]
});
