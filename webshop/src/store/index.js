//引入Vuex -----相当于咱们最大的仓库
import Vuex from "vuex";
//引入Vue
import Vue from "vue";
import createPersistedState from "vuex-persistedstate"
//使用插件
Vue.use(Vuex);
//引入home|search模块的仓库
import home from "./home";
import search from "./search";
import detail from "./detail";
import shopcart from "./shopcart";
import user from "./user";
import order from "./order";
import evaluate from "./evaluate";
import homeMS from "./homeMS";
//需要暴露Vuex.Store类的实例(你需要暴露这个类的实例，如果你不对外暴露，外部是不能使用的)
export default new Vuex.Store({
  //模块：把小仓库进行合并变为大仓库
  modules: {
    home,
    search,
    detail,
    shopcart,
    user,
    order,
    evaluate,
    homeMS
  },
  plugins: [createPersistedState({
		storage: window.sessionStorage,
    // 可选择性保存
		// reducer(val) {
    //       return {
    //       // 只储存state中的username
    //       username: val.username
    //     }
    //  }
	})]
});
