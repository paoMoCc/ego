export default [
    {
      path: '/',
      redirect:'/home'
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
      component: () => import('../views/Home/index.vue')
    },
    {
      path: '/center',
      component: () => import('../views/Center/index.vue'),
      children:[
        {
          path: '/',
          redirect:'/center/cart'
        },
        {
          path: '/center/cart',
          name:'cart',
          component: () => import('../views/Center/Cart/index.vue')
        },
        {
          path: '/center/myorder',
          name:'myorder',
          component: () => import('../views/Center/MyOrder/index.vue')
        },
        {
          path: '/center/personal',
          name:'personal',
          component: () => import('../views/Center/Personal/index.vue')
        },
        {
          path: '/center/address',
          name:'address',
          component: () => import('../views/Center/Address/index.vue')
        },
      ]
    },
    {
      path: '/search',
      name:'search',
      component: () => import('../views/Search/index.vue')
    },
    {
      path: '/detail',
      name:'detail',
      component: () => import('../views/Detail/index.vue')
    },
    

  {
    path: '/trade',
    component: () => import('../views/Trade/index.vue'),
    /* 只能从购物车界面, 才能跳转到交易界面 */
    beforeEnter (to, from, next) {
      if (from.path==='/cart') {
        next()
      } else {
        next('/cart')
      }
    }
  },
  {
    path: '/pay',
    component: () => import('../views/Pay/index.vue'),

    // 将query参数映射成props传递给路由组件
    props: route => ({orderId: route.query.orderId}),

    /* 只能从交易界面, 才能跳转到支付界面 */
    beforeEnter (to, from, next) {
      if (from.path==='/trade') {
        next()
      } else {
        next('/trade')
      }
    }
  },
  
  {
    path: '/paysuccess',
    component: () => import('../views/PaySuccess/index.vue'),
    /* 只有从支付界面, 才能跳转到支付成功的界面 */
    beforeEnter (to, from, next) {
      if (from.path==='/pay') {
        next()
      } else {
        next('/pay')
      }
    }
  },

  ]