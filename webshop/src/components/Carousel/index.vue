<template>
  <div>
    <el-carousel height="456px">
      <el-carousel-item v-for="(item,index) in bannerList" :key="index" >
        <img :src="item.src"/>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  name: "Carsousel",
  data() {
    return {
      //走马灯图片列表
      bannerList: [
        {
          src: require("./images/banner1.jpg"),
        },
        {
          src: require("./images/banner2.jpg"),
        },
        {
          src: require("./images/banner3.jpg"),
        },
        {
          src: require("./images/banner4.jpg"),
        },
      ],
    };
  },
};
</script>

<style scoped>
.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>