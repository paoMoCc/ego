//引入vue-router路由插件
import VueRouter from "vue-router";
//引入Vue
import Vue from "vue";
import routes from "./routes";
//使用插件
Vue.use(VueRouter);
//引入store
import store from "@/store";
//需要重写VueRouter.prototype原型对象身上的push|replace方法
//先把VueRouter.prototype身上的push|replace方法进行保存一份
let originPush = VueRouter.prototype.push;
let originReplace = VueRouter.prototype.replace;
//重写VueRouter.prototype身上的push方法了
VueRouter.prototype.push = function (location, resolve, reject) {
  //第一个形参：路由跳转的配置对象（query|params）
  //第二个参数：undefined|箭头函数（成功的回调）
  //第三个参数:undefined|箭头函数（失败的回调）
  if (resolve && reject) {
    //push方法传递第二个参数|第三个参数（箭头函数）
    //originPush：利用call修改上下文，变为(路由组件.$router)这个对象，第二参数：配置对象、第三、第四个参数：成功和失败回调函数
    originPush.call(this, location, resolve, reject);
  } else {
    //push方法没有产地第二个参数|第三个参数
    originPush.call(
      this,
      location,
      () => { },
      () => { }
    );
  }
};
//重写VueRouter.prototype身上的replace方法了
VueRouter.prototype.replace = function (location, resolve, reject) {
  if (resolve && reject) {
    originReplace.call(this, location, resolve, reject);
  } else {
    originReplace.call(
      this,
      location,
      () => { },
      () => { }
    );
  }
};



//对外暴露VueRouter类的实例
let router = new VueRouter({
  //配置路由
  //第一:路径的前面需要有/(不是二级路由)
  //路径中单词都是小写的
  //component右侧V别给我加单引号【字符串：组件是对象（VueComponent类的实例）】
  routes,
  //滚动行为
  scrollBehavior(to, from, savedPosition) {
    //返回的这个y=0，代表的滚动条在最上方
    return { y: 0 };
  },
  mode: 'history'
});

//全局守卫：前置守卫（在路由跳转之间进行判断）
router.beforeEach(async (to, from, next) => {
  //to:获取到要跳转到的路由信息
  //from：获取到从哪个路由跳转过来来的信息
  //next: next() 放行  next(path) 放行  
  //方便测试 统一放行
  //  next();
  //获取仓库中的token-----可以确定用户是登录了
  let token = store.state.user.token;
  let name = store.state.user.userInfo.userName;
 
  //用户登录了
  if (token) {
    //已经登录而且还想去登录注册------不行
    if (to.path == "/login" || to.path == '/register') {
      Vue.prototype.$message({
        showClose: true,
        message: "你已经登录了哦！",
        type: "error",
      });
      next('/');
    } else {
      if (name) {
        next();
      }
    }
  } else {
    //未登录（退出登录）:只能去以下页面
    let toPath = to.path;
    if (toPath == "/home" || toPath == "/login" || toPath == "/register" || toPath == "/search" || toPath == "/detail") {
      next();
    } else {
      //把未登录的时候想去而没有去成的信息，存储于地址栏中【路由】 ！！！除了后台
      if (toPath.indexOf("/backend")===-1) { next('/login?redirect=' + toPath) }
      else {
        next('/login')
      }

    }

  }
});

export default router;
