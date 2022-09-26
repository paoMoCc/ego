<template>
  <!--头部第二行 搜索区域-->
  <div class="bottom">
    <div class="logoArea">
      <!-- router-link组件本省就是一个a标签 -->
      <router-link to="/home" class="logo">
        <img src="./images/logo.png" />
      </router-link>
    </div>

    <div class="searchArea">
      <form action="###" class="searchForm">
        <input
          type="text"
          id="autocomplete"
          class="input-error input-xxlarge"
          placeholder="请输入搜索文字"
          @keyup.enter="goSearch"
          v-model="keyWord"
        />
        <button
          class="sui-btn btn-xlarge btn-danger"
          type="button"
          @click="goSearch"
        >
          搜索
        </button>
      </form>
    </div>

    <!-- <div class="cart"> -->
    <el-badge
      class="cart"
      :value="cartListLen"
      type="danger"
      :hidden="!isLogin||cartListLen===0"
    >
      <p class="box">
        <i class="el-icon-shopping-cart-2"></i>
        <span class="content">我的购物车</span>
      </p>
    </el-badge>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "SearchBar",
  data() {
    return {
      keyWord: "",
    };
  },
  methods: {
    //搜索按钮的事件处理函数，用于跳转到search路由组件当中
    goSearch() {
      if (this.$route.path !== "/search") {
        let loction = {
          name: "search",
          params: { keyWord: this.keyWord || undefined },
        };
        //代表的是如果有query参数也带过去
        // loction.query = this.$route.query;
        this.$router.push(loction)
        this.$store.dispatch("searchBykeyWord", this.$route.params.keyWord);
      } else if (this.$route.path === "/search") {
        this.$store.dispatch("searchBykeyWord", this.keyWord);
      }
    },
  },
  computed: {
    ...mapGetters(["cartListLen","isLogin"]),
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.bottom {
  width: 100%;
  height: 80px;
  margin: 10px auto;
  overflow: hidden;
  display: flex;
  justify-content: space-evenly;
  align-items: center;

  .logoArea {
    // float: left;
    height: 50px;
    .logo {
      img {
        width: 80px;
      }
    }
  }

  .searchArea {
    // float: right;

    .searchForm {
      overflow: hidden;

      input {
        box-sizing: border-box;
        width: 490px;
        height: 32px;
        padding: 0px 4px;
        border: 2px solid #ea4a36;
        float: left;

        &:focus {
          outline: none;
        }
      }

      button {
        height: 32px;
        width: 68px;
        background-color: #ea4a36;
        border: none;
        color: #fff;
        float: left;
        cursor: pointer;

        &:focus {
          outline: none;
        }
      }
    }
  }

  .cart {
    .box {
      height: 35px;
      width: 130px;
      box-sizing: border-box;
      background-color: rgb(255, 0, 54);
      color: rgb(255, 237, 237);
      display: flex;
      align-items: center;
      justify-content: space-evenly;

      & > * {
        font-weight: bold;
      }

      .el-icon-shopping-cart-2 {
        font-size: 25px;
      }
    }
  }
}
</style>