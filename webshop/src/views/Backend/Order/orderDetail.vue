<template>
  <div class="orderDetail">
    <div class="topTitle">订单详情</div>
    <!-- 步骤条 -->
    <div class="step">
      <el-steps
        :space="250"
        :active="order.status / 10"
        finish-status="success"
        :align-center="true"
      >
        <el-step
          title="提交订单"
          :description="order.status >= 10 ? order.createTime : ''"
        ></el-step>
        <el-step
          title="付款成功"
          :description="order.status >= 20 ? order.payTime : ''"
        ></el-step>
        <el-step
          title="发货"
          :description="order.status >= 30 ? order.sendTime : ''"
        ></el-step>
        <el-step
          title="确认收货"
          :description="order.status >= 40 ? order.endTime : ''"
        ></el-step>
        <el-step
          title="评价晒单"
          :description="order.status == 50 ? '已评价' : ''"
        ></el-step>
      </el-steps>
    </div>

    <!-- 订单状态 -->
    <div class="state">
      当前订单状态:<span>{{ orderStatus[order.payStatus + ""] }}</span>
    </div>

    <!-- 订单信息 -->
    <div class="orderInfo">
      <p class="infoTitle">订单信息</p>
      <p>订单编号：{{ order.orderNum }}</p>
      <p>
        收货地址：{{ order.name }}，{{ order.phone }}，{{ order.area }}，{{
          order.detailAdd
        }}
      </p>
      <p>下单时间：{{ order.createTime }}</p>
      <p>支付时间：{{ order.payTime }}</p>
      <p>支付方式：{{ order.payForm * 1 === 1 ? "微信" : "支付宝" }}</p>
      <p id="payNum">支付流水号：{{ order.payNum }}</p>
    </div>

    <!-- 订单展示 -->
    <div class="display">
      <el-table
        :data="[order]"
        stripe
        row-key="id"
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="{ 'background-color': '#F5F7FA' }"
      >
        <el-table-column label="商品信息" width="450" class="box">
          <template slot-scope="scope">
            <div class="mesSty">
              <img class="imgSty" :src="img" />
              <div class="info">
                <span class="title">
                  {{ scope.row.proName }}
                </span>
                <span class="subTitle">
                  {{ scope.row.subTitle }}
                </span>
              </div>
            </div>
            <!-- 提示 -->
            <div class="item">
              <span style="margin-left: 2%"
                >订单编号：{{ scope.row.orderNum }}</span
              >
              <span class="hint_pr">下单时间：{{ scope.row.createTime }}</span>
              <el-popover
                placement="top"
                class="hint_pr"
                width="220"
                trigger="hover"
                :content="`${scope.row.detail}`"
              >
                <span slot="reference" style="color: #f23645"
                  >卖家备注 <i class="el-icon-tickets"></i
                ></span>
              </el-popover>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          min-width="100"
          label="销售价"
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            <span> ￥{{ scope.row.price }}元 </span>
          </template>
        </el-table-column>

        <el-table-column
          prop="quantity"
          align="center"
          width="140"
          label="数量"
        >
        </el-table-column>

        <el-table-column width="150" align="center" label="订单总金额">
          <template slot-scope="scope">
            <span style="color: #ff2424"> ￥{{ scope.row.totalPrice }}元 </span>
          </template>
        </el-table-column>

        <el-table-column align="center" width="150" label="订单状态">
          <template slot-scope="scope">
            <span style="color: #ff2424">{{
              orderState[scope.row.status]
            }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 底部 -->
    <div class="total">
      <div class="box">
        <p>
          商品总价：<span class="first">￥{{ order.totalPrice }}</span>
        </p>
        <p>运费(快递)：<span class="second">￥0.00</span></p>
        <p class="bold">
          {{ order.payStatus == 1 ? "实付款：" : "应付款："
          }}<span class="third">￥{{ order.totalPrice }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      order: {
        productImgs: "",
      },
      orderStatus: {
        "-1": "已取消",
        0: "未支付",
        1: "已支付",
      },
      orderState: {
        0: "已取消",
        10: "未付款",
        20: "已付款",
        30: "已发货",
        40: "已收货",
        50: "已评价",
      },
    };
  },
  computed: {
    img() {
      if (this.order.productImgs) {
        return `http://127.0.0.1:8081/productImgs/${this.order.productImgs.split(
          "@",
          1
        )}`;
      }
    },
  },
  created() {
    let orderId = this.$route.query.orderId;
    this.$api.getOrderById(orderId).then((res) => {
      if (res.status === 200) {
        this.order = res.data;
        this.dateFormat();
      } else {
        this.$message({
          message: res.message,
          type: "error",
          duration: 1000,
        });
        console.log(res);
      }
    });
  },
  // mounted() {},
  methods: {
    dateFormat() {
      // 格式化时间
      if (this.order.createTime) {
        this.order.createTime = moment(
          new Date(this.order.createTime).getTime()
        ).format("YYYY-MM-DD HH:mm:ss");
      }
      if (this.order.payTime) {
        this.order.payTime = moment(
          new Date(this.order.payTime).getTime()
        ).format("YYYY-MM-DD HH:mm:ss");
      }
      if (this.order.sendTime) {
        this.order.sendTime = moment(
          new Date(this.order.sendTime).getTime()
        ).format("YYYY-MM-DD HH:mm:ss");
      }
      if (this.order.endTime) {
        this.order.endTime = moment(
          new Date(this.order.endTime).getTime()
        ).format("YYYY-MM-DD HH:mm:ss");
      }
      if (this.order.closeTime) {
        this.order.closeTime = moment(
          new Date(this.order.closeTime).getTime()
        ).format("YYYY-MM-DD HH:mm:ss");
      }
    },
  },
};
</script>

<style scoped>
.el-table--enable-row-transition >>> .el-table__body td {
  padding-top: 2%;
}
/deep/ .el-table tr {
  position: relative;
  width: 100%;
}
/deep/ .el-table--enable-row-transition .el-table__body td {
  padding-top: 4%;
}
.item {
  width: 1060px;
  background: #eee;
  padding: 1% 0;
  position: absolute;
  top: 0;
  left: -10px;
  z-index: 20;
}
</style>

<style lang="scss" scoped>
.orderDetail {
  width: 1060px;
  margin: 0 auto;
  .topTitle {
    font-size: 18px;
    margin-bottom: 20px;
    font-weight: bold;
  }
  //   .step{}
  .state {
    margin: 20px 0;
    font-size: 14px;
    span {
      margin-left: 10px;
      font-size: 20px;
      font-weight: bold;
      color: red;
    }
  }
  .orderInfo {
    width: 1000px;
    height: 250px;
    background-color: #f1f1f1;
    padding: 20px 20px 10px;
    & > *:first-child ~ p {
      margin: 20px 0;
    }
    .infoTitle {
      border-bottom: 1px solid rgb(166, 166, 166);
      font-weight: 700;
      padding-bottom: 5px;
    }
    #payNum {
      margin-bottom: 0;
    }
  }

  .display {
    width: 1040px;
    border: 1px solid #eee;
    margin: 20px 0;
    .hint_pr {
      padding-left: 10vh;
    }

    .mesSty {
      display: flex;
      align-items: center;
      .imgSty {
        width: 100px;
        height: 100px;
        margin-right: 10px;
        border-radius: 8px;
      }
      .info {
        width: 270px;
        display: flex;
        flex-direction: column;
      }
      .title {
        margin-bottom: 5px;
      }
      .subTitle {
        margin-top: 5px;
        font-size: 12px;
        color: #9e9e9e;
      }
    }
  }

  .total {
    width: 1043px;
    height: 150px;
    margin: 20px 0;
    background-color: #f1f1f1;
    display: flex;
    justify-content: end;
    .box {
      margin: 25px 80px 0;
      height: 100px;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      .first {
        margin-left: 68px;
      }
      .second {
        margin-left: 60px;
      }
      .third {
        margin-left: 65px;
      }
    }
  }
}
.bold {
  font-weight: bold;
  font-size: 15px;
  span {
    color: red;
  }
}
</style>