import store from "@/store";
import Vue from "vue";
export default [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/login',
    component: () => import('../views/Login/index.vue')
  },
  {
    path: '/register',
    component: () => import('../views/Register/index.vue')
  },
  {
    path: '/home',
    name:'home',
    component: () => import('../views/Home/index.vue')
  },
  {
    path: '/center',
    component: () => import('../views/Center/index.vue'),
    children: [
      {
        path: '/',
        redirect: '/center/cart'
      },
      {
        path: '/center/cart',
        name: 'cart',
        component: () => import('../views/Center/Cart/index.vue'),
      },
      {
        path: '/center/myOrder',
        name: 'myOrder',
        component: () => import('../views/Center/MyOrder/index.vue')
      },
      {
        path: '/center/personal',
        name: 'personal',
        component: () => import('../views/Center/Personal/index.vue')
      },
      {
        path: '/center/address',
        name: 'address',
        component: () => import('../views/Center/Address/index.vue')
      },
      {
        path: '/center/orderDetail',
        name: 'orderDetail',
        component: () => import('../views/Center/MyOrder/orderDetail/index.vue')
      },
    ]
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('../views/Search/index.vue')
  },
  {
    path: '/detail',
    name: 'detail',
    component: () => import('../views/Detail/index.vue')
  },


  {
    path: '/trade',
    name: 'trade',
    component: () => import('../views/Trade/index.vue'),
    /* 只能从购物车界面, 才能跳转到交易界面 */
    beforeEnter(to, from, next) {
      if (from.path === '/center/cart' || from.path === '/detail') {
        next()
      } else {
        next('/center/cart')
      }
    }
  },
  {
    path: '/pay',
    component: () => import('../views/Pay/index.vue'),
    name: 'pay',
    // 将query参数映射成props传递给路由组件
    // props: true,
    /* 只能从交易界面, 才能跳转到支付界面 */
    beforeEnter(to, from, next) {
      if (from.path === '/trade' || from.path === '/center/myOrder') {
        next()
      } else {
        next('/trade')
      }
    }
  },

  {
    path: '/paySuccess',
    name: 'paySuccess',
    component: () => import('../views/PaySuccess/index.vue'),
    /* 只有从支付界面, 才能跳转到支付成功的界面 */
    beforeEnter(to, from, next) {
      if (from.path === '/pay') {
        next()
      } else {
        next('/pay')
      }
    }
  },
  {
    path: '/backend',
    name: 'backend',
    redirect: '/backend/home',
    component: () => import('../views/Backend/index.vue'),
    beforeEnter(to, from, next) {
      let role = store.state.user.userInfo.role;
      // 用户想进入后台----------不行
      if(role === 2 && to.path.indexOf("/backend")!==-1){
        next('/home')
        Vue.prototype.$message({
          showClose: true,
          message: "没有权限！",
          type: "error",
        });
      }else{
        next()
      }
    },

    children:[
      {
        path: '/backend/home',
        name: 'homeMS',
        component: () => import('../views/Backend/Home/index.vue'),
      },
      // pms
      {
        path: '/backend/addPro',
        name: 'addPro',
        component: () => import('../views/Backend/Product/AddPro/index.vue'),
      },
      {
        path: '/backend/proCate',
        name: 'proCate',
        component: () => import('../views/Backend/Product/ProCate/index.vue'),
      },
      {
        path: '/backend/proList',
        name: 'proList',
        component: () => import('../views/Backend/Product/ProList/index.vue'),
      },
      {
        path: '/backend/updatePro',
        name: 'updatePro',
        component: () => import('../views/Backend/Product/update.vue'),
      },
      // oms
      {
        path: '/backend/order',
        name: 'order',
        component: () => import('../views/Backend/Order/index.vue'),
      },
      {
        path: '/backend/orderDetail',
        component: () => import('../views/Backend/Order/orderDetail.vue')
      },
      // check
      {
        path: '/backend/checkCate',
        name: 'checkCate',
        component: () => import('../views/Backend/Check/CheckCate/index.vue'),
      },
      {
        path: '/backend/checkPro',
        name: 'checkPro',
        component: () => import('../views/Backend/Check/CheckPro/index.vue'),
      },
      // ums
      {
        path: '/backend/authority',
        name: 'authority',
        component: () => import('../views/Backend/Authority/index.vue'),
      },
    ]
  },
]