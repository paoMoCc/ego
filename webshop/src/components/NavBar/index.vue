<template>
  <div class="header">
    <div class="left">
      <i
        :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
        @click="changeIsCollapse"
      ></i>
    </div>
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <span class="username">{{ userName }}</span>
        <img class="user-avatar" :src="userImg" />
        <i class="el-icon-caret-bottom"></i>
      </div>
      <el-dropdown-menu class="user-dropdown" slot="dropdown">
        <router-link class="inlineBlock" to="/home">
          <el-dropdown-item> 前台 </el-dropdown-item>
        </router-link>
        <el-dropdown-item divided>
          <span @click="logout" style="display: block">退出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
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
    isCollapse() {
      return this.$store.state.homeMS.isCollapse;
    },
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
    changeIsCollapse() {
      // 改变侧边栏状态  收起/展开
      this.$store.commit("changeIsCollapse");
    },
  },
};
</script>

<style lang="scss" scoped>
.el-icon-s-unfold:before,
.el-icon-s-fold:before {
  font-size: 30px;
  line-height: 40px;
}
.header {
  height: 50px;
  box-sizing: border-box;
  border-bottom: 1px solid #e6e6e6;
  .left {
    display: inline-block;
    height: 50px;
    i {
      width: 40px;
      height: 40px;
      margin-top: 5px;
      cursor: pointer;
    }
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .username {
        margin-right: 10px;
      }
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
</style>