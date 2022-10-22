<template>
  <div>
    <SearchBar></SearchBar>
    <div class="trade">
      <!-- 头部选择地址 -->
      <div class="header">
        <h2>选择收货地址</h2>

        <el-row class="addCard" :gutter="20" v-if="!address[0].noData">
          <el-col
            :span="6"
            v-for="(item, index) in address"
            :key="item.addressId"
            ><div
              :class="
                item.addressId === activeId
                  ? 'grid-content active'
                  : 'grid-content'
              "
              @click="choseIt(item.addressId)"
            >
              <div class="tip" v-if="index === 0">默认地址</div>
              <p class="first">{{ item.area }}（{{ item.name }}收）</p>
              <p>{{ item.detailAdd }},{{ item.phone }}</p>
              <router-link to="/center/address" class="last">修改</router-link>
            </div></el-col
          >
        </el-row>
        <h1 class="null" v-else>还没有收货地址快去添加吧！</h1>

        <router-link class="manage" to="/center/address"
          >管理收货地址</router-link
        >

        <h2>确认订单信息</h2>

        <el-table
          ref="multipleTable"
          tooltip-effect="dark"
          :data="$route.query.checkList"
          style="width: 950px"
          :header-cell-style="{
            'text-align': 'center',
            'background-color': '#EAEAEA',
          }"
          :cell-style="{ 'text-align': 'center' }"
        >
          <!-- 商品名称 -->
          <el-table-column label="商品名称" width="350">
            <template slot-scope="scope">
              <div class="proName">
                <img
                  :src="`http://127.0.0.1:8081/productImgs/${scope.row.productImgs.split(
                    '@',
                    1
                  )}`"
                />
                <div class="describe">
                  <span class="title">{{ scope.row.proName }}</span>
                  <!-- <span>{{scope.row.detail}}</span> -->
                  <span class="stock">库存:{{ scope.row.stock }}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <!-- 单价 -->
          <el-table-column label="单价" width="200">
            <template slot-scope="scope">
              <span class="uniPrice"
                >￥{{ scope.row.uniPrice.toFixed(2) }}</span
              >
            </template>
          </el-table-column>
          <!-- 数量 -->
          <el-table-column label="数量" width="200">
            <template slot-scope="scope">
              {{ scope.row.quantity }}
            </template>
          </el-table-column>
          <!-- 小计 -->
          <el-table-column label="小计" width="200">
            <span class="price">￥{{ $route.query.total.toFixed(2) }}</span>
          </el-table-column>
        </el-table>

        <div class="bottom">
          <div class="box">
            <p>
              <span class="btitle">应付款：</span
              ><span class="price">￥{{ $route.query.total.toFixed(2) }}</span>
            </p>
            <p>
              <span class="btitle">寄送至：</span
              ><span>{{ confirmAdd.area }} {{ confirmAdd.detailAdd }}</span>
            </p>
            <p>
              <span class="btitle">收货人：</span
              ><span>{{ confirmAdd.name }} {{ confirmAdd.phone }}</span>
            </p>
          </div>
          <button class="cancel" @click="cancel">取消</button>
          <button class="submit" @click="submit">提交订单</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import SearchBar from "@/components/SearchBar";
export default {
  components: { SearchBar },
  data() {
    return {
      activeId: -1,
      confirmAdd: {},
    };
  },
  computed: {
    ...mapState({
      address: (state) => state.order.address,
    }),
  },
  methods: {
    choseIt(id) {
      this.activeId = id;
      this.confirmAdd = this.address.filter((item) => item.addressId === id)[0];
    },
    // 下单
    submit() {
      if (this.address[0].noData) {
        this.$message({
          message: "先去添加地址吧！",
          type: "info",
          duration: 1000,
        });
        setTimeout(() => {
          this.$router.replace({name:"address"});
        }, 1000);
      } else {
        let cartIds = this.$route.query.checkList.map((item) => item.carId);
        const loading = this.$loading({
          lock: true,
          text: "订单生成中...",
          spinner: "el-icon-loading",
          background: "rgba(255, 255, 255, 0.8)",
        });
        setTimeout(() => {
          loading.close();
          this.$router.replace({
            name: "pay",
            params: {
              cartIds,
              addressId: this.activeId,
              total: this.$route.query.total,
              buyNow: this.$route.query.buyNow,
              product: this.$route.query.checkList[0],
            },
          });
        }, 2000);
      }
    },
    // 取消
    cancel() {
      // 立即购买取消后跳转到商品详情页面
      if (this.$route.query.buyNow) {
        this.$router.go(-2);
      } else {
        // 正常流程跳转购物车
        this.$router.push("/center/cart");
      }
    },
  },
  mounted() {
    this.$store.dispatch("getMyAddress");
    this.activeId = this.address[0].addressId;
    this.confirmAdd = this.address[0];
  },
};
</script>

<style lang="scss">
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
<style lang="scss" scoped>
.trade {
  margin-left: 250px;
  width: 1000px;
  .header {
    h2 {
      margin: 10px 0;
    }
    // address卡片布局start
    .el-row {
      &:last-child {
        margin-bottom: 0;
      }
    }
    .el-col {
      border-radius: 10px;
      margin-bottom: 20px;
      cursor: pointer;
      position: relative;
      .first {
        font-weight: 700;
        padding-bottom: 5px;
        border-bottom: 1px solid #f2f2f2;
      }
      .last {
        width: 30px;
        color: #cc9977;
        &:hover {
          color: red;
          cursor: pointer;
        }
      }
      .tip {
        width: 55px;
        height: 18px;
        line-height: 18px;
        text-align: center;
        position: absolute;
        top: 0;
        right: 10px;
        background-color: #ccc;
        color: #fff;
      }
    }
    // address无数据提示
    .null {
      margin: 0 325px 20px;
    }
    .grid-content {
      box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
      padding: 10px;
      border-radius: 4px;
      min-height: 110px;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      & > * {
        display: block;
      }
      &:first-child {
        border: 1px solid #ede8ed;
      }
    }
    // address卡片布局end
    .manage {
      color: #cc9977;
      &:hover {
        color: red;
        cursor: pointer;
      }
    }
    // 表格
    .proName {
      display: flex;
      img {
        width: 110px;
        height: 110px;
        margin-right: 10px;
        border-radius: 8px;
      }
      // 描述
      .describe {
        width: 200px;
        display: flex;
        flex-direction: column;
        text-align: start;
        justify-content: space-around;
        .title {
          color: #6a6a6a;
        }
        .stock {
          font-size: 13px;
          color: #9e9e9e;
        }
      }
    }
  }
  .bottom {
    margin: 20px 0 50px 600px;
    .box {
      width: 330px;
      height: 120px;
      padding: 10px;
      border: 1px solid #ff0036;
      box-shadow: 0 0 1px #ff0036;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: flex-end;
      .price {
        font-size: 26px;
        color: #ff0036;
        font-weight: bold;
      }
      .btitle {
        font-weight: 700;
      }
    }
    button {
      width: 176px;
      height: 40px;
      font-size: 14px;
      border: none;
      font-weight: bold;
      text-align: center;
      cursor: pointer;
    }
    .cancel {
      background-color: rgb(255, 237, 237);
      color: rgb(255, 0, 54);
    }
    .submit {
      color: #fff;
      background-color: #ff0036;
    }
  }
  .active {
    border-color: #66afe9;
    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
      0 0 8px rgba(102, 175, 233, 0.6);
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
      0 0 8px rgba(102, 175, 233, 0.6) !important;
  }
}
</style>