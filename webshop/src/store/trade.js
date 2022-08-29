import { getAddress,getOrder,updateAddress,deleteAddress,addAddress } from '@/api'
import Vue from 'vue';
const state = {
  address: [],
  orderInfo:[]
};
const mutations = {
  GETUSERADDRESS(state, address) {
    state.address = address;
  },
  GETORDERINFO(state,orderInfo){
     state.orderInfo = orderInfo;
  }
};
const actions = {
  //获取用户地址信息
 async getMyAddress({commit}){
  let res = await getAddress()
  if (res.status === 200) {
    commit('GETUSERADDRESS',res.data)
  }else if(res.status === 201){
    commit("GETUSERADDRESS", [])
  }else {
    Vue.prototype.$message({
      showClose: true,
      message: res.message,
      type: "error",
    });
  }
 },
  //获取商品清单数据
  async getMyOrder({commit},type=undefined){
    let res = await getOrder(type)
    if (res.status === 200) {
      commit('GETORDERINFO',res.data)
    }else if(res.status === 201){
      commit("GETORDERINFO", [])
    }else {
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
