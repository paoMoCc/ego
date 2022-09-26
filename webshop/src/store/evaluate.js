import { getComment,evaluate,delComment } from "@/api";
import Vue from "vue";
const state = {
    review: {
      all:[],
      bad:[],
      normal:[],
      good:[]
    },
  };
  const mutations = {
    GETREVIEW(state, review) {
      state.review.all = review;
      state.review.bad = review.filter(item => item.rate === 1||item.rate === 2)
      state.review.normal = review.filter(item => item.rate === 3)
      state.review.good = review.filter(item => item.rate === 4||item.rate === 5)
    },
  };
  const actions = {
    // 获取评价
     async getComents({commit},proId){
      let res = await getComment(proId*1)
      if (res.status===200) {
        commit("GETREVIEW",res.data)
      }
     },
    // 删除评价
    async delComments({dispatch},data){
      let res = await delComment(data.commentId)
      if (res.status===200) {
        // 删除评价成功之后重新获取评价列表
        dispatch("getComents",data.proId)
        Vue.prototype.$message({
          showClose: true,
          message: res.message,
          type: "success",
        });
      } else {
        Vue.prototype.$message({
          showClose: true,
          message: res.message,
          type: "error",
        });
      }
    }
  };
  //简化数据而生
  const getters = {
  };
  export default {
    state,
    actions,
    mutations,
    getters,
  };
  