<template>
  <div>
    <SearchBar></SearchBar>
    <TypeNav></TypeNav>
    <ListContainer></ListContainer>
  </div>
</template>

<script>
import SearchBar from '../../components/SearchBar'
import ListContainer from "./ListContainer";
export default {
  name:'Home',
  components:{SearchBar,ListContainer},
  data() {
    return {
      input: "",
    };
  },
  computed: {},
  methods: {
    
  },
};
</script>

<style lang="scss" scoped>


</style>