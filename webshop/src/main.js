import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import ajax from './api/ajax';
import * as api from '@/api';
//定义全局组件：在入口文件注册一次之后，在任何组件当中都可以使用
import typeNav from "@/components/TypeNav";
import Carsousel from "@/components/Carousel";
//全局组件：第一个参数 组件名字  第二个参数：那个组件
Vue.component(typeNav.name, typeNav);
Vue.component(Carsousel.name, Carsousel);

Vue.prototype.$msgbox = ElementUI.MessageBox;
Vue.prototype.$alert = ElementUI.MessageBox.alert;
Vue.prototype.$message = ElementUI.Message;


Vue.use(ElementUI);
Vue.config.productionTip = false
Vue.prototype.$axios = ajax

// 监听存储事件，防止用户修改数据
window.addEventListener('storage', function (e) {
  sessionStorage.setItem(e.key,e.oldValue)
});

new Vue({
  //全局事件总线$bus配置
  beforeCreate() {
    Vue.prototype.$bus = this;
    Vue.prototype.$api = api;
  },
  router,
  store,
  render: h => h(App)
}).$mount('#app')
