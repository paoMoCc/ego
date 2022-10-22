<template>
  <div id="backend">
    <el-container>
      <el-aside style="width: auto"><SideBar></SideBar></el-aside>
      <el-container>
        <el-header><NavBar></NavBar></el-header>
        <el-main>
          <transition name="fade" mode="out-in">
            <router-view></router-view> </transition
        ></el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import NavBar from "../../components/NavBar";
import SideBar from "../../components/SideBar";
export default {
  components: { NavBar, SideBar },
};
</script>

<style lang="scss" scoped>
.el-header {
  padding: 0;
  height: 50px !important;
}
.el-main {
  padding: 20px;
}
</style>