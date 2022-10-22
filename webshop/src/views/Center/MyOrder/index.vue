<template>
  <div class="myorder">
    <el-tabs v-model="activeName" @tab-click="handleClick" class="topNav">
      <el-tab-pane label="所有订单" name="all"> </el-tab-pane>
      <el-tab-pane label="待付款" name="10"> </el-tab-pane>
      <el-tab-pane label="待发货" name="20"> </el-tab-pane>
      <el-tab-pane label="待收货" name="30"> </el-tab-pane>
      <el-tab-pane label="待评价" name="40"> </el-tab-pane>
      <el-tab-pane label="已评价" name="50"> </el-tab-pane>
    </el-tabs>
    <el-table
      :data="tableData"
      stripe
      row-key="id"
      :header-cell-style="{ 'text-align': 'center' }"
      v-if="tableData.length"
      ref="elTable"
    >
      <el-table-column label="商品信息" width="450" class="box">
        <template slot-scope="scope">
          <div class="mesSty">
            <img
              class="imgSty"
              :src="`http://127.0.0.1:8081/productImgs/${scope.row.productImgs.split(
                '@',
                1
              )}`"
            />
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
            <span style="margin-left: 1%"
              >订单编号：{{ scope.row.orderNum }}</span
            >
            <span class="hint_pr"
              >下单时间：{{
                scope.row.createTime | datefmt("YYYY-MM-DD HH:mm:ss")
              }}</span
            >
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

      <el-table-column prop="quantity" align="center" width="150" label="数量">
      </el-table-column>

      <el-table-column align="center" width="150" label="订单状态">
        <template slot-scope="scope">
          <span style="color: #ff2424">{{ orderState[scope.row.status] }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150" align="center" label="订单总金额">
        <template slot-scope="scope">
          <span style="color: #ff2424"> ￥{{ scope.row.totalPrice }}元 </span>
        </template>
      </el-table-column>

      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template slot-scope="scope">
          <div class="detail">
            <a type="primary" @click="goDetail(scope.row)">订单详情</a>
            <a
              type="primary"
              v-if="scope.row.status === 10"
              @click="goPay(scope.row)"
              >去支付</a
            >
            <a
              type="primary"
              v-if="scope.row.status === 10"
              @click="cancelOrder(scope.row)"
              >取消订单</a
            >
            <a
              type="primary"
              v-if="scope.row.status === 30"
              @click="goReceive(scope.row)"
              >去收货</a
            >
            <a
              type="primary"
              v-if="scope.row.status === 40"
              @click="goEvaluate(scope.row)"
              >去评价</a
            >
            <a
              type="primary"
              v-if="scope.row.status === 50 || scope.row.status === 0"
              @click="deleteOrder(scope.row)"
              >删除订单</a
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 空状态 -->
    <el-empty
      v-else
      :image-size="312"
      description="哎呀！什么也没有呢~~"
    ></el-empty>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      activeName: "all",
      tableData: [],
      orderState: {
        0: "已取消",
        10: "未付款",
        20: "已付款",
        30: "已发货",
        40: "已收货",
        50: "已评价",
      },
      loading: false,
    };
  },
  computed: {
    ...mapState({
      orderInfo: (state) => state.order.orderInfo,
    }),
  },
  methods: {
    // 切换订单类型
    handleClick(tab, event) {
      let type = event.target.id.split("-")[1];
      if (type === "all") {
        this.tableData = this.orderInfo.all
      } else {
        this.tableData = this.orderInfo[type * 1]
      }
    },
    // 查看详情
    goDetail(item) {
      this.$router.push({
        // params刷新要丢失
        // name:'orderDetail',
        // params:item
        path: "/center/orderDetail",
        query: item,
      });
    },
    // 取消订单
    cancelOrder(item) {
      this.$confirm("确定要取消该订单吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$api.cancelOrder([item.orderId]).then((res) => {
          if (res.status === 200) {
            // 取消订单成功后重新获取订单列表
            this.$store.dispatch("getMyOrder").then(() => {
              this.tableData = this.orderInfo[this.activeName]
            });
            this.$message({
              type: "success",
              message: res.message,
            });
          } else {
            this.$message({
              type: "error",
              message: res.message,
            });
          }
        });
      });
    },
    // 去支付
    goPay(item) {
      const loading = this.$loading({
        lock: true,
        text: "正在前往支付...",
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.8)",
      });
      setTimeout(() => {
        loading.close();
        this.$router.replace({
          name: "pay",
          params: { total: item.totalPrice, checkList: [item], repay: true },
        });
      }, 2000);
    },
    // 去收货
    goReceive(item) {
      this.$confirm("请拿到包裹之后再确认！", "确定要收货吗?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$api.receivePro(item.orderId).then((res) => {
            if (res.status === 200) {
              // 收货成功后重新获取订单列表
              this.$store.dispatch("getMyOrder").then(() => {
                this.tableData = this.orderInfo[this.activeName]
              });
              this.$message({
                type: "success",
                message: res.message,
              });
            } else {
              this.$message({
                type: "error",
                message: res.message,
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消收货",
          });
        });
    },
    // 去评价
    goEvaluate(item) {
      this.$router.push({
        name: "detail",
        query: item,
      });
    },
    // 删除订单
    deleteOrder(item) {
      this.$confirm("此操作不可逆！", "确定要删除该订单吗?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$api.delOrder({orderId:item.orderId}).then((res) => {
            if (res.status === 200) {
              // 删除订单成功后重新获取订单列表
              this.$store.dispatch("getMyOrder").then(() => {
                this.tableData = this.orderInfo[this.activeName]
              });
              this.$message({
                type: "success",
                message: res.message,
              });
            } else {
              this.$message({
                type: "error",
                message: res.message,
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
  created() {
    this.$store.dispatch("getMyOrder").then(() => {
      this.tableData = this.orderInfo.all;
    });
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
  padding-top: 3.5%;
}
.item {
  width: 115.5em;
  background: #eee;
  padding: 1% 0;
  position: absolute;
  top: 0;
  left: -10px;
  z-index: 20;
}
</style>

<style lang="scss" scoped>
.myorder {
  margin-left: 160px;
  width: 1200px;
  .topNav {
    margin-left: 10px;
  }
}
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

.detail {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  font-size: 12px;
  &:first-child {
    padding-top: 10px;
  }
  & > *:hover {
    color: red;
    text-decoration: underline;
    cursor: pointer;
  }
}
</style>