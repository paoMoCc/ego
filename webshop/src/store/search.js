import { getAllPro, getProByCateId, searchPro } from '@/api'
//search模块的仓库
const state = {
  //仓库初始状态
  searchList: [],
  tags: []
};
const mutations = {
  UPDATESEARCHLIST(state, data) {
    state.searchList = data||[];
  },
  ADDTAGCATE(state, tag) {
    // 添加分类标签
    if (!state.tags.some(item => item.name === tag.info.cateName)) {
      state.tags.push(tag)
    }
  },
  ADDTAGKEYWORD(state, tag) {
    // 添加关键词标签
    if (!state.tags.some(item => item.name === tag.keyWord)) {
      state.tags.push(tag)
    }
  },
  DELETETAG(state, index) {
    state.tags.splice(index, 1)
  },
  CLEARSEARCHLIST(state) {
    state.searchList = []
  }
};
const actions = {
  //首页点击分类跳到搜索页面
  async searchByCate({ commit }, params = {}) {
    // 根据分类cateId搜索后会添加一个tag标签
    let result = await getProByCateId({ cateId: params.cateid * 1 });
    if (result.status === 200) {
      commit("UPDATESEARCHLIST", result.data)
      commit("ADDTAGCATE", {
        name: params.catename,
        type: "warning",
        info: {
          cateId: params.cateid,
          rootId: params.rootid,
          cateName: params.catename,
        },
      })
    } else if (result.status === 201) {
      // 如果搜索结果为空则清空搜索列表，添加tag标签，页面返回提示信息
      commit("CLEARSEARCHLIST")
      commit("ADDTAGCATE", {
        name: params.catename,
        type: "warning",
        info: {
          cateId: params.cateid,
          rootId: params.rootid,
          cateName: params.catename,
        },
      })
    }
  },
  //根据搜索页面的dropdown菜单搜索商品
  async searchByDropDown({ commit }, item) {
    // 根据分类cateId搜索后会添加一个tag标签
    let result = await getProByCateId({ cateId: item.cateId * 1 });
    if (result.status === 200) {
      commit("UPDATESEARCHLIST", result.data);
      commit("ADDTAGCATE", {
        name: item.cateName,
        type: "warning",
        info: {
          cateId: item.cateId,
          rootId: item.rootId,
          cateName: item.cateName,
        },
      })
    } else if (result.status === 201) {
      // 如果搜索结果为空则清空搜索列表，添加tag标签，页面返回提示信息
      commit("CLEARSEARCHLIST")
      commit("ADDTAGCATE", {
        name: item.cateName,
        type: "warning",
        info: {
          cateId: item.cateId,
          rootId: item.rootId,
          cateName: item.cateName,
        },
      })
    }
  },
  //点击tag搜索商品
  async searchByTag({ commit }, params = {}) {
    // 根据对应的cateId或keyWord搜索商品
    if (params.cateid) {
      let result = await getProByCateId({ cateId: params.cateid * 1 });
      if (result.status === 200) {
        commit("UPDATESEARCHLIST", result.data);
      } else if (result.status === 201) {
        // 如果搜索结果为空则清空搜索列表，页面返回提示信息
        commit("CLEARSEARCHLIST")
      }
    } else if (params.keyWord) {
      let result = await searchPro({ keyWord: params.keyWord });
      if (result.status === 200) {
        commit("UPDATESEARCHLIST", result.data);
      } else if (result.status === 201) {
        // 如果搜索结果为空则清空搜索列表，页面返回提示信息
        commit("CLEARSEARCHLIST")
      }
    }
  },
  // 获取全部商品
  async getAllProduct({ commit }) {
    let result = await getAllPro();
    if (result.status === 200) {
      commit("UPDATESEARCHLIST", result.data);
    }
  },

  // 根据关键字搜索
  async searchBykeyWord({ commit }, keyWord) {
    // 根据分类keyWord搜索后也会添加一个tag标签
    let result = await searchPro({ keyWord: keyWord });
    if (result.status === 200) {
      commit("UPDATESEARCHLIST", result.data);
      commit("ADDTAGKEYWORD", {
        name: keyWord,
        type: "warning",
        keyWord: keyWord
      })
    } else if (result.status === 201) {
      // 如果搜索结果为空则清空搜索列表，添加tag标签，页面返回提示信息
      commit("CLEARSEARCHLIST")
      commit("ADDTAGKEYWORD", {
        name: keyWord,
        type: "warning",
        keyWord: keyWord
      })
    }

  },
};
//计算属性
//项目当中getters主要的作用是:简化仓库中的数据(简化数据而生)
//可以把我们将来在组件当中需要用的数据简化一下【将来组件在获取数据的时候就方便了】
const getters = {};
export default {
  state,
  mutations,
  actions,
  getters,
};
