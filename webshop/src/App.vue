<template>
  <div id="app">
    <Header v-if="$route.path.indexOf('/backend')"></Header>
    <router-view></router-view>
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

<style>
#app {
  position: relative;
  width: 100%;
  min-height: 752px;
  /*设置padding-bottom

 值大于等于footer的height值，

 以保证main的内容能够全部显示出

 来而不被footer遮盖；*/
  padding-bottom: 100px;
  box-sizing: border-box;
}
</style>
