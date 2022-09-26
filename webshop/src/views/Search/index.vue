<template>
  <div>
    <SearchBar></SearchBar>
    <TypeNav></TypeNav>

    <!-- 分类菜单 -->
    <div class="classify">
      <el-dropdown v-for="c1 in categoryList" :key="c1.cateId">
        <span class="el-dropdown-link">
          {{ c1.cateName }} <el-divider direction="vertical"></el-divider>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="c2 in c1.child"
            :key="c2.cateId"
            @click.native="handleDown(c2)"
            >{{ c2.cateName }}</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <!-- tag标签 -->
    <div class="tag">
      <el-tag type="info" @click="getAll">全部商品</el-tag>
      <el-tag
        v-for="(tag, index) in tags"
        :key="tag.name"
        closable
        :type="tag.type"
        @close="handleClose(index)"
        @click="handleClick(tag)"
      >
        {{ tag.name || tag.keyWord }}
      </el-tag>
    </div>

    <!-- 商品列表 -->
    <div class="goods" v-if="!isSearchListNull">
      <!-- 如果搜索结果为空，则不显示该列表，显示提示信息 -->
      <el-row>
        <el-col :span="5" v-for="item in searchList" :key="item.proId">
          <img
            :src="`http://127.0.0.1:8081/productImgs/${item.productImgs.split(
              '@',
              1
            )}`"
            alt=""
            @click="gotoDetail(item)"
          />
          <!-- <img v-lazy="good.defaultImg" /> -->
          <div class="info">
            <em>￥ </em><span>{{ item.price }}.00</span>
            <p>{{ item.proName }}</p>
          </div>
          <div class="operate">
            <a class="sui-btn btn-bordered btn-danger" @click="addCart(item)"
              >加入购物车</a
            >
            <a href="javascript:void(0);" class="sui-btn btn-bordered">收藏</a>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 提示信息，当搜索列表为空时显示 -->
    <div class="message" v-else>
      <el-empty
        :image-size="250"
        description="哎呀！该分类还没有在售的商品~~"
      ></el-empty>
    </div>

    <!-- <button @click="show">testShow</button> -->
  </div>
</template>

<script>
import SearchBar from "../../components/SearchBar";
import { mapGetters, mapState } from "vuex";
export default {
  name: "Search",
  components: { SearchBar },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      categoryList: (state) => state.home.categoryList,
    }),
    ...mapState({
      tags: (state) => state.search.tags,
    }),
    ...mapState({
      searchList: (state) => state.search.searchList,
    }),
    isSearchListNull() {
      return this.searchList.length === 0;
    },
    ...mapGetters(["isLogin"]),
  },
  methods: {
    //加入购物车
    async addCart(item) {
      // console.log(this.$store.state.user.userInfo);
      // 如果还没登录就先去登录，成功后回到当前页面
      if (!this.isLogin) {
        this.$router.push({
          path: "/login",
          query: {
            redirect: this.$router.currentRoute.fullPath,
          },
        });
      } else {
        // 如果已经登录
        this.$api
          .addToCart({
            proId: item.proId * 1,
            productImgs: item.productImgs,
            quantity: 1,
          })
          .then((res) => {
            // 添加购物车成功
            if (res.status === 200) {
              // 更新购物车列表
              this.$store.dispatch("getCartList");
              this.$message({
                showClose: true,
                message: res.message,
                type: "success",
              });
            } else {
              this.$message({
                showClose: true,
                message: res.message,
                type: "error",
              });
            }
          })
          .catch((error) => console.log(error));
      }
    },
    // 删除tag回调函数
    handleClose(index) {
      // let lastTag = this.tags[this.tags.length - 2];
      // 移除仓库中对应的tag元素
      this.$store.commit("DELETETAG", index);
    },
    handleClick(tag) {
      // console.log(tag);

      // 根据tag类型发请求获取searchList
      // 1.分类类型
      if (tag.info) {
        this.$store.dispatch("searchByTag", { cateid: tag.info.cateId });
      } else if (tag.keyWord) {
        this.$store.dispatch("searchByTag", { keyWord: tag.keyWord });
      }
    },
    getAll() {
      this.$store.dispatch("getAllProduct");
    },
    handleDown(c2) {
      this.$store.dispatch("searchByDropDown", c2);
    },
    gotoDetail(item) {
      this.$router.push({ name: "detail", query: item });
    },
  },
  mounted() {
    // 获取所有分类
    this.$store.dispatch("getCate");
  },
};
</script>

<style lang="scss" scoped>
.classify {
  width: 100%px;
  background-color: rgb(225, 37, 27);
  padding: 5px 5px 5px 160px;
  & > * {
    margin-right: 5px;
  }
  .el-divider {
    width: 2px;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: rgb(255, 255, 255);
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
}

.tag {
  padding-left: 155px;
  & > * {
    margin: 10px 5px 0;
    cursor: pointer;
  }
  & > *:hover {
    box-shadow: 0 0 8px;
  }
}

.goods {
  margin: 0 150px;
  .info {
    padding: 0 5px;
  }
  .info > em,
  span {
    color: red;
    font-weight: bold;
  }
  .el-row {
    margin-bottom: 20px;
    & > *:hover {
      box-shadow: 0 0 8px;
      cursor: pointer;
      //   transform: translateX(-5px) translateY(-5px);
    }
  }
  .el-col {
    border: 1px solid grey;
    border-radius: 8px;
    margin: 10px 10px 0 10px;
    img {
      width: 100%;
      height: 267px;
      border-radius: 8px 8px 0 0;
    }
  }

  .operate {
    padding: 12px 0;
    margin-left: 30px;

    .sui-btn {
      display: inline-block;
      padding: 2px 14px;
      box-sizing: border-box;
      margin-bottom: 0;
      font-size: 12px;
      line-height: 18px;
      text-align: center;
      vertical-align: middle;
      cursor: pointer;
      border-radius: 0;
      background-color: transparent;
      margin-right: 15px;
    }

    .btn-bordered {
      min-width: 85px;
      background-color: transparent;
      border: 1px solid #8c8c8c;
      color: #8c8c8c;

      &:hover {
        border: 1px solid #666;
        color: #fff !important;
        background-color: #666;
        text-decoration: none;
      }
    }

    .btn-danger {
      border: 1px solid #e1251b;
      color: #e1251b;

      &:hover {
        border: 1px solid #e1251b;
        background-color: #e1251b;
        color: white !important;
        text-decoration: none;
      }
    }
  }
}
</style>