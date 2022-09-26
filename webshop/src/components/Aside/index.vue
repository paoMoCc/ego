<template>
  <div>

    <div class="aside">
      <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
        <el-radio-button :label="false">展开</el-radio-button>
        <el-radio-button :label="true">收起</el-radio-button>
      </el-radio-group>
      <el-menu
        :default-active="this.$route.path"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        :collapse="isCollapse"
        :router="true"
      >
        <el-menu-item  index="/center/cart">
            <i class="el-icon-shopping-cart-full"></i>
            <span slot="title">购物车</span>
        </el-menu-item>

        <el-menu-item index="/center/myOrder">
          <i class="el-icon-tickets"></i>
          <span slot="title">我的订单</span>
        </el-menu-item>
        
        <el-menu-item index="/center/address">
          <i class="el-icon-location-information"></i>
          <span slot="title">收货地址</span>
        </el-menu-item>

        <el-menu-item index="/center/personal">
          <i class="el-icon-user"></i>
          <span slot="title">个人信息</span>
        </el-menu-item>
      </el-menu>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: false,
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
  },
};
</script>

<style>

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 160px;
  min-height: 550px;
}
.el-menu--collapse{
  width: 60px;
  min-height: 550px;
}
</style>

<style lang="scss" scoped>

</style>