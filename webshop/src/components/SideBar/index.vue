<template>
  <el-menu
    default-active="/backend"
    class="el-menu-vertical-demo"
    :router="true"
    @open="handleOpen"
    @close="handleClose"
    background-color="#304156"
    text-color="#BFCBD9"
    active-text-color="#409EFF"
    :collapse="isCollapse"
  >
    <el-menu-item index="home">
      <i class="el-icon-s-home"></i>
      <span slot="title">首页</span>
    </el-menu-item>
    <el-submenu index="pms">
      <template slot="title">
        <i class="el-icon-s-goods"></i>
        <span>商品</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="/backend/proList">商品列表</el-menu-item>
        <el-menu-item index="/backend/addPro">添加商品</el-menu-item>
        <el-menu-item index="/backend/proCate">商品分类</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
    <el-submenu index="oms">
      <template slot="title">
        <i class="el-icon-s-order"></i>
        <span>订单</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="/backend/order">商品发货</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
    <el-submenu index="check" v-if="isAdmin">
      <template slot="title">
        <i class="el-icon-s-check"></i>
        <span>审核</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="/backend/checkPro">商品审核</el-menu-item>
        <el-menu-item index="/backend/checkCate">分类审核</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
    <el-submenu index="ums" v-if="isAdmin">
      <template slot="title">
        <i class="el-icon-s-management"></i>
        <span>权限</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="/backend/authority">用户权限</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  data() {
    return {};
  },
  computed: {
    isCollapse() {
      return this.$store.state.homeMS.isCollapse;
    },
    ...mapGetters(["isAdmin"])
  },
  methods: {
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
    },
  },
};
</script>
<style lang="scss">
div.el-menu-item-group__title{
  padding: 0 !important;
}
</style>
<style lang="scss" scoped>
.el-menu {
  height: 100% !important;
  min-height: 100vh !important;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 180px;
  height: 100%;
}
.el-menu--collapse {
  width: 60px;
  height: 100%;
}
.el-submenu .el-menu-item {
  // height: 50px;
  // line-height: 50px;
  // padding: 0 45px;
  min-width: 180px;
  background-color: #263445 !important;
  &:hover {
    background-color: #001528 !important;
  }
}

</style>