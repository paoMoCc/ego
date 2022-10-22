import { getAddress, getOrder, updateAddress, deleteAddress, addAddress } from '@/api'
import Vue from 'vue';
const state = {
  address: [],
  orderInfo: {
    all: [],
    10: [],
    20: [],
    30: [],
    40: [],
    50: [],
  }
};
const mutations = {
  GETUSERADDRESS(state, address) {
    state.address = address;
  },
  GETORDERINFO(state, orderInfo) {
    state.orderInfo.all = orderInfo
    for (let i = 10; i < 60; i += 10) {
      state.orderInfo[i] = orderInfo.filter(item => item.status === i)
    }
  }
};
const actions = {
  //获取用户地址信息
  async getMyAddress({ commit }) {
    let res = await getAddress()
    let defaultAdd = [{ area: 'N/A', detailAdd: 'N/A', name: 'N/A', phone: 'N/A',noData:true }]
    if (res.status === 200) {
      if (res.data.length) {
        commit('GETUSERADDRESS', res.data)
      } else {
        commit("GETUSERADDRESS", defaultAdd)
      }
    } else if (res.status === 201) {
      commit("GETUSERADDRESS", defaultAdd)
    } else {
      Vue.prototype.$message({
        showClose: true,
        message: res.message,
        type: "error",
      });
    }
  },
  //获取商品清单数据
  async getMyOrder({ commit }) {
    let res = await getOrder()
    if (res.status === 200) {
      await commit('GETORDERINFO', res.data)
    } else if (res.status === 201) {
      await commit("GETORDERINFO", [])
    } else {
      Vue.prototype.$message({
        showClose: true,
        message: res.message,
        type: "error",
      });
    }
  },
};
const getters = {};
export default {
  state,
  mutations,
  actions,
  getters,
};
