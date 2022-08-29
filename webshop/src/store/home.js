import { getCate } from "@/api";
import toTree from '@/utils/arrayToTree'
//home模块的仓库
const state = {
  //home仓库中存储三级菜单的数据
  categoryList: [],
  //轮播图的数据
  bannerList: [],
  //floor组件的数据
  floorList: []
};
//mutations是唯一修改state的地方
const mutations = {
  GETCATEGORYLIST(state, categoryList) {
    state.categoryList = toTree(categoryList);
  },
  GETFLOORLIST(state, floorList) {
    state.floorList = floorList;
  }
};
//action|用户处理派发action地方的，可以书写异步语句、自己逻辑地方
const actions = {
  async getCate({ commit }) {
    //getCate返回的是一个Promise对象
    //需要用await接受成功返回的结果，await必须要结合async一起使用（CP）
    let result = await getCate();
    if (result.status == 200) {
      commit("GETCATEGORYLIST", result.data);
    }
  },
};
//计算属性
const getters = {};
export default {
  state,
  mutations,
  actions,
  getters,
};
