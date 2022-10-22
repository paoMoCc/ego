<template>
  <div id="app">
    <div id="wapper">
      <Header v-if="$route.path.indexOf('/backend')"></Header>
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
    <Footer v-if="$route.path.indexOf('/backend')"></Footer>
  </div>
</template>

<script>
import Header from "./components/Header";
import Footer from "./components/Footer";
export default {
  components: { Header, Footer },
  data() {
    return {};
  },
  mounted() {
    window.addEventListener("unload", this.saveState);
  },
  methods: {
    saveState() {
      sessionStorage.setItem("state", JSON.stringify(this.$store.state));
    },
  },
};
</script>

<style lang="scss">
@import "src/styles/transition.scss";
#app {
  position: relative;
  width: 100%;
  /* min-height: 752px; */
  min-height: 100vh;
  /*设置padding-bottom

 值大于等于footer的height值，

 以保证main的内容能够全部显示出

 来而不被footer遮盖；*/
  /* padding-bottom: 100px; */
  box-sizing: border-box;
  #wapper {
    min-height: calc(100vh - 100px);
  }
}
</style>
