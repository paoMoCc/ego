<template>
  <header class="header">
    <!-- 头部的第一行 -->
    <div class="top">
      <div class="container">
        <div class="loginList">
          <p v-if="$route.path === '/home'">易购欢迎您！</p>
          <p v-else><router-link to="/home">首页</router-link></p>

          <!-- 没有用户名：未登录 -->
          <p v-if="!userName">
            <span>请</span>
            <!-- 声明式导航：router-link务必要有to属性 -->
            <router-link
              :to="{
                path: '/login',
                query: {
                  redirect: this.$router.currentRoute.fullPath,
                }
              }"
              >登录</router-link
            >
            <router-link class="register" to="/register">免费注册</router-link>
          </p>
          <!-- 登录了 -->
          <p v-else>
            <el-avatar class="avatar" size="small" :src="userImg"></el-avatar>
            <a class="username">{{ userName }}</a>
            <a class="register" @click="logout">退出登录</a>
          </p>
        </div>
        <div class="typeList">
          <router-link to="/center">个人中心</router-link>
          <router-link to="/center/myorder">我的订单</router-link>
          <router-link to="/center/cart">我的购物车</router-link>
          <router-link to="/backend" v-if="isLogin&&!isUser">商家后台</router-link>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: "Header",
  data() {
    return {};
  },
  methods: {
    //退出登录
    logout() {
      this.$confirm("确定要退出登录吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 确认退出登录
          this.$store.commit("CLEAR");
          this.$message({
            type: "success",
            message: "退出登录成功!",
          });
          // 刷新页面
          location.reload();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退出登录",
          });
        });
    },
  },
  computed: {
    //用户名信息
    userName() {
      // 有昵称就用昵称没有就用用户名
      return this.$store.state.user.userInfo.nickName
        ? this.$store.state.user.userInfo.nickName
        : this.$store.state.user.userInfo.userName;
    },
    userImg() {
      let userImg = this.$store.state.user.userInfo.userImg;
      return userImg
        ? userImg
        : "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png";
    },
    ...mapGetters(["isUser","isLogin"])
  },
};
</script>

<style scoped lang="scss">
.header {
  & > .top {
    background-color: #eaeaea;
    height: 30px;
    line-height: 30px;

    .container {
      width: 1200px;
      margin: 0 auto;
      overflow: hidden;

      .loginList {
        float: left;

        p {
          float: left;
          margin-right: 10px;

          .avatar {
            float: left;
            width: 25px;
            height: 25px;
            margin-top: 2.5px;
          }
          .username {
            border-left: 1px solid #b3aeae;
            padding: 0 5px;
            margin-left: 5px;
          }
          .register {
            border-left: 1px solid #b3aeae;
            padding: 0 5px;
            margin-left: 5px;
            cursor: pointer;
          }
        }
      }

      .typeList {
        float: right;
        margin-right: 65px;
        a {
          padding: 0 10px;

          & + a {
            border-left: 1px solid #b3aeae;
          }
        }
      }
    }
  }
}
</style>
