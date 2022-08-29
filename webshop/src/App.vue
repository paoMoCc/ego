<template>
  <div id="app">
    <Header></Header>
    <router-view></router-view>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from './components/Header'
import Footer from './components/Footer'
export default {
  components:{Header,Footer},
  data() {
    return {};
  },
  mounted() {
    
    window.addEventListener('unload',this.saveState)
  },
  methods: {
    saveState(){
      sessionStorage.setItem('state',JSON.stringify(this.$store.state))
    }
  },
};
</script>

<style>

</style>
