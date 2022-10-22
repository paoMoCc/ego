<template>
   
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          type="primary"
          @click="handleSearchList()"
          size="small"
        >
          查询搜索
        </el-button>
        <el-button
          style="float: right; margin-right: 15px"
          @click="handleResetSearch()"
          size="small"
        >
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form
          :inline="true"
          :model="listQuery"
          size="small"
          label-width="140px"
        >
          <el-form-item label="输入搜索：">
            <el-input
              v-model="listQuery.orderNum"
              class="input-width"
              placeholder="订单编号"
            ></el-input>
          </el-form-item>
          <el-form-item label="收货人姓名：">
            <el-input
              v-model="listQuery.userName"
              class="input-width"
              placeholder="收货人姓名"
            ></el-input>
          </el-form-item>
          <el-form-item label="收货人电话：">
            <el-input
              v-model="listQuery.phone"
              class="input-width"
              placeholder="收货人手机号码"
            ></el-input>
          </el-form-item>

          <el-form-item label="订单状态：">
            <el-select
              v-model="listQuery.status"
              class="input-width"
              placeholder="全部"
              clearable
            >
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="提交时间：">
            <el-date-picker
              class="input-width"
              v-model="listQuery.createTime"
              align="right"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
    <div class="table-container">
      <el-table
        ref="orderTable"
        :data="list"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        v-loading="listLoading"
        border
      >
        <el-table-column
          type="selection"
          width="60"
          align="center"
        ></el-table-column>
        <el-table-column label="编号" width="80" align="center">
          <template slot-scope="scope">{{ scope.row.orderId }}</template>
        </el-table-column>
        <el-table-column label="订单编号" width="200" align="center">
          <template slot-scope="scope">{{ scope.row.orderNum }}</template>
        </el-table-column>
        <el-table-column label="提交时间" width="200" align="center">
          <template slot-scope="scope">{{
            scope.row.createTime | formatCreateTime
          }}</template>
        </el-table-column>
        <el-table-column label="买家账号" width="110" align="center">
          <template slot-scope="scope">{{ scope.row.userName }}</template>
        </el-table-column>
        <el-table-column label="卖家账号" width="110" align="center">
          <template slot-scope="scope">{{ scope.row.ownerName }}</template>
        </el-table-column>
        <el-table-column label="订单金额" width="110" align="center">
          <template slot-scope="scope">￥{{ scope.row.totalPrice }}</template>
        </el-table-column>
        <el-table-column label="支付状态" width="110" align="center">
          <template slot-scope="scope">{{
            scope.row.status | formatPayType
          }}</template>
        </el-table-column>

        <el-table-column label="订单状态" width="110" align="center">
          <template slot-scope="scope">{{
            scope.row.status | formatStatus
          }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleViewOrder(scope.$index, scope.row)"
              >查看订单</el-button
            >
            <el-button
              size="mini"
              @click="handleDeliveryOrder(scope.$index, scope.row)"
              v-show="scope.row.status === 20"
              >订单发货</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDeleteOrder(scope.$index, scope.row)"
              v-show="scope.row.status === 50 || scope.row.status === 0"
              >删除订单</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 底部 -->
    <div class="bottom">
      <!-- 批量操作 -->
      <div class="batch-operate-container">
        <el-select size="small" v-model="operateType" placeholder="批量操作">
          <el-option
            v-for="item in operateOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-button
          style="margin-left: 20px"
          class="search-button"
          @click="handleBatchOperate()"
          type="primary"
          size="small"
        >
          确定
        </el-button>
      </div>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout="total, sizes,prev, pager, next,jumper"
          :current-page.sync="listQuery.pageNum"
          :page-size="listQuery.pageSize"
          :page-sizes="[5, 10, 15]"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { formatDate } from "@/utils/date";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 5,
  orderNum: null,
  userName: null,
  phone: null,
  status: null,
  createTime: null,
};
export default {
  name: "orderList",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      listLoading: true,
      list: null,
      total: null,
      operateType: null,
      multipleSelection: [],
      // 日期选择器快捷选项
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            },
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            },
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            },
          },
        ],
      },
      statusOptions: [
        {
          label: "已取消",
          value: 0,
        },
        {
          label: "待付款",
          value: 10,
        },
        {
          label: "待发货",
          value: 20,
        },
        {
          label: "待收货",
          value: 30,
        },
        {
          label: "待评价",
          value: 40,
        },
        {
          label: "已评价",
          value: 50,
        },
      ],
      operateOptions: [
        {
          label: "批量发货",
          value: 1,
        },
        {
          label: "删除订单",
          value: 2,
        },
      ],
      logisticsDialogVisible: false,
    };
  },
  created() {
    this.getList();
  },
  filters: {
    formatCreateTime(time) {
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    },
    formatPayType(value) {
      if (value > 10) {
        return "已支付";
      } else {
        return "未支付";
      }
    },
    formatStatus(value) {
      if (value === 0) {
        return "已取消";
      } else if (value === 10) {
        return "待付款";
      } else if (value === 20) {
        return "待发货";
      } else if (value === 30) {
        return "待收货";
      } else if (value === 40) {
        return "待评价";
      } else if (value === 50) {
        return "已评价";
      } else {
        return "unknown";
      }
    },
  },
  methods: {
    // 重置表单
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    // 筛选订单
    handleSearchList() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    // checkbox
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 查看订单
    handleViewOrder(index, row) {
      this.$router.push({
        path: "/backend/orderDetail",
        query: { orderId: row.orderId },
      });
    },
    // 订单发货
    handleDeliveryOrder(index, row) {
      this.sendProduct({ orderId: row.orderId });
    },
    // 删除订单
    handleDeleteOrder(index, row) {
      this.deleteOrder({ orderId: row.orderId });
    },
    // 批量操作
    handleBatchOperate() {
      if (this.multipleSelection == null || this.multipleSelection.length < 1) {
        this.$message({
          message: "请选择要操作的订单",
          type: "warning",
          duration: 1000,
        });
        return;
      }
      if (this.operateType === 1) {
        //批量发货
        let orderId = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          orderId.push(this.multipleSelection[i].orderId);
        }
        this.sendProduct({ orderId });
      } else if (this.operateType === 2) {
        //删除订单
        let orderId = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          orderId.push(this.multipleSelection[i].orderId);
        }
        this.deleteOrder({ orderId });
      }
    },
    // 分页
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    // 获取订单数据
    getList() {
      this.listLoading = true;
      this.$api.getOrderData(this.listQuery).then((res) => {
        if (res.status === 200) {
          this.listLoading = false;
          this.list = res.data;
          this.total = res.total;
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
    // 发货req
    sendProduct(orderId) {
      this.$confirm("是否要进行该操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$api.sendPro(orderId).then((res) => {
          if (res.status === 200) {
            this.$message({
              message: res.message,
              type: "success",
              duration: 1000,
            });
            this.listQuery.pageNum = 1;
            this.listQuery.pageSize = 5;
            this.getList();
          } else {
            this.$message({
              message: res.message,
              type: "error",
              duration: 1000,
            });
            console.log(res);
          }
        });
      });
    },
    // 删除订单req
    deleteOrder(orderId) {
      this.$confirm("是否要进行该删除操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$api.delOrder(orderId).then((res) => {
          if (res.status === 200) {
            this.$message({
              message: res.message,
              type: "success",
              duration: 1000,
            });
            this.listQuery.pageNum = 1;
            this.listQuery.pageSize = 5;
            this.getList();
          } else {
            this.$message({
              message: res.message,
              type: "error",
              duration: 1000,
            });
            console.log(res);
          }
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.input-width {
  width: 203px;
}
.operate-container {
  margin: 20px 0;
}
.bottom {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
</style>


