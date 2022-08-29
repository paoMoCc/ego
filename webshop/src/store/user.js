import {getUserInfo} from '@/api'
import jwtDecode from 'jwt-decode'
import Vue from 'vue';
//登录与注册的模块
const state = {
  token: '',
  userInfo: {},
};

// const state = sessionStorage.getItem('state')?JSON.parse(sessionStorage.getItem('state')).user:defaultState

const actions = {
  async getMyInfo({commit}){
    let result = await getUserInfo()
    if (result.status === 200) {
      commit("CHANGEUSERINFO",result.data)
    }else{
      Vue.prototype.$message({
        showClose: true,
        message: result.message,
        type: "error",
      });
    }
  }
};
const mutations = {
  USERLOGIN(state, token) {
    state.token = token;
    state.userInfo = jwtDecode(token)
  },
  // 修改用户信息
  CHANGEUSERINFO(state,userInfo){
    state.userInfo = userInfo
  },
  // 修改用户头像
  CHANGEAVATAR(state,imgUrl){
    state.userImg = imgUrl
  },
  //清除本地数据
  CLEAR(state) {
    //帮仓库中先关用户信息清空
    state.token = '';
    state.userInfo = {};

  }
};
const getters = {
  isUser(state) {
    return state.userInfo.role === 2
  },
  isMechant(state) {
    return state.userInfo.role === 1
  },
  isAdmin(state) {
    return state.userInfo.role === 0
  },
  isLogin(state,getters) {
    // return state.userInfo.userId === undefined ? false : true
    return getters.isAdmin || getters.isMechant || getters.isUser
  },
};
export default {
  state,
  mutations,
  actions,
  getters,
};
