<template>
  <div class="detail">
    <SearchBar></SearchBar>
    <!-- 商品分类导航 -->
    <TypeNav></TypeNav>

    <!-- 主要内容区域 -->
    <section class="con">
      <!-- 主要内容区域 -->
      <div class="mainCon">
        <!-- 左侧放大镜区域 -->
        <div class="previewWrap">
          <el-carousel height="435px">
            <el-carousel-item v-for="(item, index) in imgList" :key="index">
              <img :src="item" />
            </el-carousel-item>
          </el-carousel>
        </div>
        <!-- 右侧选择区域布局 -->
        <div class="InfoWrap">
          <div class="goodsDetail">
            <h3 class="InfoName">{{ product.proName }}</h3>
            <p class="news">{{ product.detail }}</p>
            <div class="priceArea">
              <div class="priceArea1">
                <div class="title">
                  价&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;格
                </div>
                <div class="price">
                  <i>¥</i>
                  <em>{{ product.price }}</em>
                  <span>降价通知</span>
                </div>
                <div class="remark">
                  <i>累计评价</i>
                  <em>65545</em>
                </div>
              </div>
              <div class="priceArea2">
                <div class="title">
                  <i>促&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;销</i>
                </div>
                <div class="fixWidth">
                  <i class="red-bg">加价购</i>
                  <em class="t-gray"
                    >满999.00另加20.00元，或满1999.00另加30.00元，或满2999.00另加40.00元，即可在购物车换购热销商品</em
                  >
                </div>
              </div>
            </div>
            <div class="support">
              <div class="supportArea">
                <div class="title">
                  支&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;持
                </div>
                <div class="fixWidth">
                  以旧换新，闲置手机回收 4G套餐超值抢 礼品购
                </div>
              </div>
              <div class="supportArea">
                <div class="title">配 送 至</div>
                <div class="fixWidth">广东省 深圳市 宝安区</div>
              </div>
            </div>
          </div>

          <div class="box">
            <div class="quantity">
              <el-input-number
                v-model="num"
                :min="1"
                :max="product.stock * 1"
                size="mini"
                :step-strictly="true"
              ></el-input-number>
              <span
                >&nbsp;&nbsp;&nbsp;件&nbsp;&nbsp;&nbsp;{{
                  product.stock > 0 ? "有货" : "缺货"
                }}</span
              >
            </div>
            <div class="wanted">
              <el-button type="danger" @click="buyNow">立即购买</el-button>
              <el-button type="danger" @click="addCart"
                ><i class="el-icon-shopping-cart-2"></i>加入购物车</el-button
              >
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import SearchBar from "../../components/SearchBar";
export default {
  name: "Detail",
  data() {
    return {
      product: {},
      imgList: [],
      //购买产品的个数
      num: 1,
    };
  },
  components: {
    SearchBar,
  },
  mounted() {
    //派发action获取产品详情的信息
    this.product = this.$route.query;
    // 加工一下数据库存储的img路径
    let arr = [];
    arr = this.product.productImgs.split("@");
    this.imgList = arr.map(
      (item) => `http://127.0.0.1:8081/productImgs/${item}`
    );
  },
  computed: {
    // 用户是否登录
    ...mapGetters(["isLogin"]),
  },
  methods: {
    // 立即购买
    buyNow() {
      alert("此功能待完善哦！");
    },
    //加入购物车
    async addCart() {
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
            proId: this.product.proId * 1,
            productImgs: this.product.productImgs,
            quantity: this.num,
          })
          .then((res) => {
            // 添加购物车成功
            if (res.status === 200) {
              // 更新购物车列表
              this.$store.dispatch("getCartList")
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
        // try {
        //   //成功
        //   let res = await this.$store.dispatch("addInCart", {
        //     proId: this.product.proId*1,
        //     productImgs: this.product.productImgs,
        //     quantity: "",
        //   });
        //   if (res.status === 200){
        //      this.$message({
        //       showClose: true,
        //       message: res.message,
        //       type: "success",
        //     });
        //   }else{
        //     this.$message({
        //       showClose: true,
        //       message: res.message,
        //       type: "error",
        //     });
        //   }
        // } catch (error) {
        //   //失败
        //   alert(error.message);
        // }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.detail {
  .con {
    width: 1200px;
    margin: 15px auto 0;

    .mainCon {
      overflow: hidden;
      margin: 5px 0 15px;

      .previewWrap {
        float: left;
        width: 450px;
        position: relative;
        img {
          width: 100%;
        }
      }

      .InfoWrap {
        width: 700px;
        float: right;

        .InfoName {
          font-size: 14px;
          line-height: 21px;
          margin-top: 15px;
        }

        .news {
          color: #e12228;
          margin-top: 15px;
        }

        .priceArea {
          background: #fee9eb;
          padding: 7px;
          margin: 13px 0;

          .priceArea1 {
            overflow: hidden;
            line-height: 28px;
            margin-top: 10px;

            .title {
              float: left;
              margin-right: 15px;
            }

            .price {
              float: left;
              color: #c81623;

              i {
                font-size: 16px;
              }

              em {
                font-size: 24px;
                font-weight: 700;
              }

              span {
                font-size: 12px;
              }
            }

            .remark {
              float: right;
            }
          }

          .priceArea2 {
            overflow: hidden;
            line-height: 28px;
            margin-top: 10px;

            .title {
              margin-right: 15px;
              float: left;
            }

            .fixWidth {
              width: 520px;
              float: left;

              .red-bg {
                background: #c81623;
                color: #fff;
                padding: 3px;
              }

              .t-gray {
                color: #999;
              }
            }
          }
        }

        .support {
          border-bottom: 1px solid #ededed;
          padding-bottom: 5px;

          .supportArea {
            overflow: hidden;
            line-height: 28px;
            margin-top: 10px;

            .title {
              margin-right: 15px;
              float: left;
            }

            .fixWidth {
              width: 520px;
              float: left;
              color: #999;
            }
          }
        }

        .box {
          margin-top: 30px;
          display: flex;
          flex-direction: column;
          .quantity {
            font-size: 12px;
            margin-bottom: 30px;
            .el-input-number {
              width: 100px;
            }
          }

          .wanted {
            & > :first-child {
              background-color: rgb(255, 237, 237);
              color: rgb(255, 0, 54);
            }
            & > * {
              width: 180px;
              height: 40px;
              i {
                font-weight: bold;
                margin-right: 5px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
