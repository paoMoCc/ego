<template>
  <div class="cart">
    <el-table
      v-if="cartList.length"
      ref="multipleTable"
      tooltip-effect="dark"
      :data="cartList"
      style="width: 1200px"
      :header-cell-style="{
        'text-align': 'center',
        'background-color': '#EAEAEA',
      }"
      :cell-style="{ 'text-align': 'center' }"
      @selection-change="handleSelectionChange"
    >
      <!-- 选择器 -->
      <el-table-column type="selection" width="50"></el-table-column>
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
          <span class="uniPrice">￥{{ scope.row.uniPrice.toFixed(2) }}</span>
        </template>
      </el-table-column>
      <!-- 数量 -->
      <el-table-column label="数量" width="200">
        <template slot-scope="scope">
          <el-input-number
            v-model="scope.row.quantity"
            @change="handleChange($event, scope.row)"
            :min="1"
            :max="scope.row.stock"
            :step-strictly="true"
            size="small"
            style="width: 120px"
          ></el-input-number>
        </template>
      </el-table-column>
      <!-- 小计 -->
      <el-table-column label="小计" width="200">
        <template slot-scope="scope">
          <span class="price">￥{{ scope.row.price.toFixed(2) }}</span>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 空状态 -->
    <el-empty
      v-else
      :image-size="360"
      description="哎呀！购物车空空如也~~"
    ></el-empty>
    <!-- 结算栏 -->
    <div class="buy" v-if="checkList.length">
      <div class="leftbox">
        <el-link icon="el-icon-delete" type="danger" @click="deleteSelected"
          >删除所选</el-link
        >
      </div>
      <div class="rightbox">
        <div class="left">
          <span class="total"
            >合计(不含运费):<em>￥{{ total.toFixed(2) }}</em></span
          >
          <span class="quantity"
            >共计<em>{{ checkList.length }}</em
            >件商品</span
          >
        </div>
        <div class="right">
          <el-button
            type="danger"
            class="btn"
            @click="goPay"
            v-loading.fullscreen.lock="fullscreenLoading"
            >去结算</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      fullscreenLoading: false,
      total: 0,
    };
  },
  computed: {
    ...mapState({
      cartList: (state) => state.shopcart.cartList,
    }),
    ...mapState({
      checkList: (state) => state.shopcart.checkList,
    }),
  },
  mounted() {
    this.$store.dispatch("getCartList");
    this.$store.commit("CHECKCARTITEM");
  },
  methods: {
    // 删除
    handleDelete(index, row) {
      this.$store.dispatch("delFromCart", row.carId);
    },
    // 处理选择器选中事件
    handleSelectionChange(val) {
      let that = this;
      that.total = 0;
      val.forEach((element) => {
        that.total += element.price;
      });
      this.$store.commit("CHECKCARTITEM", val);
    },
    // 删除所选
    deleteSelected() {
      let arr = [];
      this.checkList.forEach((element) => {
        arr.push(element.carId);
      });
      this.$store.dispatch("delFromCart2", arr);
      // 删除后清空checklist
      this.$store.commit("CHECKCARTITEM");
    },
    // 修改数量
    handleChange(value, row) {
      this.$store.dispatch("updateQuantity", {
        proId: row.proId,
        quantity: Math.round(value),
      });
    },
    // 去支付
    goPay() {
      this.fullscreenLoading = true;
      setTimeout(() => {
        this.fullscreenLoading = false;
        this.$router.push({
          name: "trade",
          query: { total: this.total, checkList: this.checkList },
        });
      }, 2000);
    },
    
  },
};
</script>

<style lang="scss">
// 表格样式
.cart {
  //   修改表格鼠标悬浮hover背景色
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #edfff9;
  }
}
</style>
<style lang="scss" scoped>
.cart {
  margin-left: 160px;
  //   商品名称
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
  .buy {
    display: flex;
    justify-content: space-between;
    width: 1200px;
    height: 80px;
    background-color: #fff4e8;

    .leftbox {
      line-height: 80px;
      margin-left: 30px;
      & > *:hover {
        text-decoration: underline;
      }
    }

    .rightbox {
      display: flex;
      .left {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        .total {
          em {
            color: #ff3d3d;
            font-size: 18px;
            font-weight: bold;
          }
        }
        .quantity {
          em {
            color: #ff3d3d;
            font-size: 14px;
            font-weight: bold;
            margin: 0 5px;
          }
        }
      }
      .right {
        .btn {
          width: 140px;
          height: 80px;
          font-size: 20px;
          margin-left: 10px;
          border-radius: 0;
        }
      }
    }
  }
}
</style>