import { getCartPro, removeFromCart, removeFromCart2, changeQuantity } from '@/api'
import Vue from 'vue';
const state = {
  cartList: [],
  checkList: [],
};
const mutations = {
  GETCARTLIST(state, cartList) {
    state.cartList = cartList;
  },

  //修改购物车某一个产品的选中状态
  CHECKCARTITEM(state, arr=[]) {
    state.checkList = arr
  },
};
const actions = {

  //获取购物车列表数据
  async getCartList({ commit }) {
    let res = await getCartPro()
    if (res.status === 200) {
      commit("GETCARTLIST", res.data)
    } else if(res.status === 201){
      commit("GETCARTLIST", [])
    } else {
      Vue.prototype.$message({
        showClose: true,
        message: res.message,
        type: "error",
      });
    }
  },

  //删除购物车某一个产品
  async delFromCart({ dispatch },carId) {
    let res = await removeFromCart(carId * 1)
    if (res.status === 200) {
      // 删除成功过后更新列表
      dispatch("getCartList")
    } else {
      Vue.prototype.$message({
        showClose: true,
        message: res.message,
        type: "error",
      });
    }
  },

  //删除全部勾选的产品
  async delFromCart2({ dispatch },carId) {
    let res = await removeFromCart2(carId)
    if (res.status === 200) {
      // 删除成功过后更新列表
      dispatch("getCartList")
    }else {
      Vue.prototype.$message({
        showClose: true,
        message: res.message,
        type: "error",
      });
    }
  },

  //修改数量
  async updateQuantity({ dispatch }, data) {
    let res = await changeQuantity(data)
    if (res.status === 200) {
      // 修改数量成功过后更新列表
      dispatch("getCartList")
    } else {
      Vue.prototype.$message({
        showClose: true,
        message: res.message,
        type: "error",
      });
    }
  }

};
const getters = {
  cartListLen(state) {
    return state.cartList.length;
  },
};
export default {
  state,
  mutations,
  actions,
  getters,
};
