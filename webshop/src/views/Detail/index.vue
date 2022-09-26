<template>
  <div class="detail">
    <SearchBar></SearchBar>
    <!-- 商品分类导航 -->
    <TypeNav></TypeNav>

    <!-- 主要内容区域 -->
    <section class="con">
      <!-- 主要内容区域 -->
      <div class="mainCon">
        <!-- 左侧轮播图区域 -->
        <div class="previewWrap">
          <el-carousel height="450px">
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
                  <i>库存：</i>
                  <em>{{ product.stock }}</em>
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
              <el-button
                type="danger"
                @click="buyNow"
                v-loading.fullscreen.lock="fullscreenLoading"
                >立即购买</el-button
              >
              <el-button type="danger" @click="addCart"
                ><i class="el-icon-shopping-cart-2"></i>加入购物车</el-button
              >
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="line"></div>

    <!-- 评价区域 -->
    <div class="eval">
      <!-- 写评价 -->
      <div class="coment" v-if="isShow">
        <div class="left">
          <img :src="imgList[0]" alt="" />
          <div class="box">
            <p class="name">{{ product.proName }}</p>
            <p class="price">
              ￥{{ product.totalPrice }}
              <span style="margin-left: 40px"
                >共：{{ product.quantity }}件</span
              >
            </p>
          </div>
        </div>
        <div class="right">
          <div class="rate">
            <span>商品满意度</span>
            <el-rate v-model="rate" show-text :colors="colors"></el-rate>
          </div>
          <div class="textArea">
            <span>发表评价</span>
            <el-input
              type="textarea"
              placeholder="请输入内容"
              v-model="textarea"
              maxlength="200"
              :autosize="{ minRows: 3, maxRows: 4 }"
              show-word-limit
              :autofocus="true"
            >
            </el-input>
          </div>
          <div class="bottom">
            <el-button class="btn" type="danger" @click="evaluate"
              >提交</el-button
            >
          </div>
        </div>
      </div>
      <!-- 评论区 -->
      <div class="rates">
        <div class="topBar">
          <el-radio-group v-model="radio" @change="switchTab">
            <el-radio label="all">全部</el-radio>
            <el-radio label="good">好评</el-radio>
            <el-radio label="normal">中评</el-radio>
            <el-radio label="bad">差评</el-radio>
          </el-radio-group>
          <span class="count">累计评论：{{ review.all.length }}条</span>
        </div>
        <!-- 评论列表 -->
        <div class="table" v-for="item in reviewList" :key="item.comentId">
          <div class="left">
            <p class="txt">{{ item.content }}</p>
            <p class="date">{{ item.createTime | datefmt("YYYY/MM/DD") }}</p>
          </div>
          <div class="score">
            <el-rate v-model="item.rate" disabled text-color="#ff9900">
            </el-rate>
          </div>
          <div class="right">
            <el-avatar class="avatar" :src="item.userImg"></el-avatar>
            <p class="name">
              {{ item.userName }} <span>({{ item.nickName }})</span>
            </p>
          </div>
          <!-- 空状态 -->
        </div>
        <div class="null" v-if="!reviewList.length">什么都没有找到~~</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import SearchBar from "../../components/SearchBar";
export default {
  name: "Detail",
  data() {
    return {
      fullscreenLoading: false,
      // 写评论区是否显示
      isShow: false,
      product: {},
      //购买产品的个数
      num: 1,
      // 写评论区域
      rate: null,
      colors: ["#99A9BF", "#F7BA2A", "#FF9900"],
      textarea: "",
      // 评论区
      radio: "all",
      // 评论列表
      reviewList: [],
      iconClasses: ["icon-rate-face-1", "icon-rate-face-2", "icon-rate-face-3"],
    };
  },
  components: {
    SearchBar,
  },
  mounted() {
    //派发action获取产品详情的信息
    this.product = this.$route.query;
    // 判断是否显示写评论区域
    this.product.orderId && (this.isShow = true);
    this.$store.dispatch("getComents", this.product.proId).then(() => {
      this.reviewList = this.review.all;
    });
  },
  computed: {
    // 用户是否登录
    ...mapGetters(["isLogin"]),
    imgList() {
      // 加工一下数据库存储的img路径
      let arr = [];
      if (this.product.productImgs) {
        arr = this.product.productImgs.split("@");
        return arr.map((item) => `http://127.0.0.1:8081/productImgs/${item}`);
      }
    },
    ...mapState({
      review: (state) => state.evaluate.review,
    }),
  },
  methods: {
    // 筛选评论
    switchTab(value) {
      this.reviewList = this.review[value].sort((a, b) => {
        return (
          new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
        );
      });
      console.log(this.review, this.reviewList);
    },
    // 立即购买
    buyNow() {
      this.fullscreenLoading = true;
      let product = this.product;
      product.uniPrice = product.price * 1;
      // product.price = product.price*this.num
      product.quantity = this.num;
      setTimeout(() => {
        this.fullscreenLoading = false;
        this.$router.push({
          name: "trade",
          query: {
            total: this.product.price * this.num,
            checkList: [this.product],
            buyNow: true,
          },
        });
      }, 2000);
    },
    //加入购物车
    async addCart() {
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
    // 评价订单
    evaluate() {
      if (this.textarea.trim() == "") {
        this.$message({
          showClose: true,
          message: "评论内容不能为空哦！",
          type: "error",
        });
      } else {
        this.$api
          .evaluate({
            proId: this.product.proId,
            orderId: this.product.orderId,
            content: this.textarea,
            rate: this.rate * 1,
          })
          .then((res) => {
            if (res.status === 200) {
              // 关闭写评论区域
              this.isShow = false;
              // 评价成功之后重新获取评价列表
              this.$store.dispatch("getComents", this.product.proId);
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
            // 清空表单
            this.rate = null;
            this.textarea = "";
          });
      }
    },
    // 删除评论
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
          height: 100%;
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

  .line {
    width: 100%;
    height: 2px;
    background-color: #e1251b;
    margin-bottom: 15px;
  }
  .eval {
    .coment {
      width: 1200px;
      margin: 0 auto;
      display: flex;
      .left {
        width: 400px;
        padding: 20px;
        display: flex;
        position: relative;
        text-align: start;
        border: 1px solid #ccc;
        .orderNum {
          position: absolute;
        }
        img {
          width: 150px;
          height: 150px;
          border-radius: 8px;
          margin-right: 10px;
        }
        .box {
          width: 180px;
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          .name {
          }
          .price {
            color: red;
          }
        }
      }
      .right {
        width: 800px;
        padding: 20px;
        border: 1px solid #ccc;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .rate {
          display: flex;
          span {
            width: 60px;
            margin-right: 50px;
          }
        }
        .textArea {
          width: 750px;
          display: flex;
          span {
            width: 70px;
            margin-right: 50px;
          }
        }
        .bottom {
          display: flex;
          .btn {
            margin-left: 110px;
          }
        }
      }
    }
    .rates {
      width: 1200px;
      margin: 15px auto;
      .topBar {
        height: 25px;
        line-height: 25px;
        background-color: rgba($color: #ccc, $alpha: 0.2);
        padding-left: 5px;
      }
      .count {
        font-size: 14px;
        line-height: 25px;
        margin-left: 720px;
      }
    }
    .table {
      min-height: 130px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #ccc;
      & > * {
        padding: 16px 7px;
      }
      .left {
        width: 600px;
        min-height: 99px;
        padding: 16px 30px 16px 24px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .date {
          color: #ccc;
        }
      }
      .score {
        width: 400px;
        text-align: center;
      }
      .right {
        width: 200px;
        padding: 16px 0 16px 24px;
        display: flex;
        .name {
          font-size: 14px;
          margin: 20px 0 0 10px;
          & > span {
            font-size: 12px;
            color: #ccc;
          }
        }
      }
    }
    .null {
      min-height: 132px;
      font-size: 20px;
      line-height: 130px;
      text-align: center;
      margin: 0 auto;
    }
  }
}
</style>
