<template>
  <div class="container">
    <!-- 顶部筛选区域 -->
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          class="search-btn"
          @click="handleSearchList()"
          type="primary"
          size="small"
        >
          查询结果
        </el-button>
        <el-button class="reset-btn" @click="handleResetSearch()" size="small">
          重置
        </el-button>
      </div>
      <div class="form-box">
        <el-form
          :inline="true"
          :model="listQuery"
          size="small"
          label-width="140px"
        >
          <el-form-item label="输入搜索：">
            <el-input
              class="by-keyword"
              v-model="listQuery.userName"
              placeholder="用户名"
            ></el-input>
          </el-form-item>
          <el-form-item label="创建时间：">
            <el-date-picker
              class="input-width by-keyword"
              v-model="listQuery.createTime"
              align="right"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="用户角色：">
            <el-select v-model="listQuery.role" placeholder="请选择">
              <el-option
                v-for="item in roleOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="性别：">
            <el-select v-model="listQuery.sex" placeholder="请选择">
              <el-option
                v-for="item in sexOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态：">
            <el-select v-model="listQuery.state" placeholder="请选择">
              <el-option
                v-for="item in stateOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <!-- 中部 -->
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
    <!-- 表格区域 -->
    <div class="table-container">
      <el-table
        ref="productTable"
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
        <el-table-column label="用户头像" width="150" align="center">
          <template slot-scope="scope"
            ><img
              style="height: 120px; width: 120px"
              :src="
                scope.row.userImg
                  ? scope.row.userImg
                  : 'http://localhost:8081/userAvatars/default.png'
              "
            />
          </template>
        </el-table-column>
        <el-table-column label="账号" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.userName }}</p>
          </template>
        </el-table-column>
        <el-table-column label="性别" align="center">
          <template slot-scope="scope">{{
            scope.row.sex | verifySex
          }}</template>
        </el-table-column>
        <el-table-column label="角色" align="center">
          <template slot-scope="scope">
            <!-- <p>{{ scope.row.role | verifyRole }}</p> -->
            <el-select v-model="scope.row.role" @change="changeRole(scope.row)">
              <el-option
                v-for="item in roleOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.state === 0 ? 'success' : 'danger'">{{
              scope.row.state | verifyState
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.createTime | formatCreateTime }}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <p>
              <!-- <el-button
                size="mini"
                type="info"
                @click="editUser(scope.$index, scope.row)"
                >编辑
              </el-button> -->
              <el-button
                size="mini"
                type="warning"
                @click="banUser(scope.$index, scope.row)"
                v-if="scope.row.state !== 1"
                >封禁
              </el-button>
              <el-button
                size="mini"
                type="success"
                @click="deblockUser(scope.$index, scope.row)"
                v-if="scope.row.state === 1"
                >解封
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="delUser(scope.$index, scope.row)"
                >删除
              </el-button>
            </p>
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
            v-for="item in operates"
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
          :page-size="listQuery.pageSize"
          :page-sizes="[5, 10, 15]"
          :current-page.sync="listQuery.pageNum"
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
  userName: null,
  role: null,
  sex: null,
  createTime: null,
  state: null,
  pageNum: 1,
  pageSize: 5,
};
export default {
  data() {
    return {
      // 筛选条件对象
      listQuery: Object.assign({}, defaultListQuery),
      // 用户身份配置
      roleOptions: [
        {
          value: 0,
          label: "管理员",
        },
        {
          value: 1,
          label: "商家",
        },
        {
          value: 2,
          label: "客户",
        },
      ],
      // 用户身份配置
      sexOptions: [
        {
          value: 0,
          label: "女",
        },
        {
          value: 1,
          label: "男",
        },
        {
          value: 2,
          label: "未知",
        },
      ],
      // 用户状态配置
      stateOptions: [
        {
          value: 0,
          label: "正常",
        },
        {
          value: 1,
          label: "封禁",
        },
      ],
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
      //   选择框数据
      multipleSelection: [],
      //   商品列表
      list: null,
      listLoading: false,
      //   批量操作
      operateType: null,
      operates: [
        {
          label: "批量封禁",
          value: 0,
        },
        {
          label: "批量解封",
          value: 1,
        },
        {
          label: "批量删除",
          value: 2,
        },
      ],
      //   分页数据总数
      total: null,
    };
  },
  filters: {
    formatCreateTime(time) {
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd");
    },
    verifySex(value) {
      if (value === 0) {
        return "女";
      } else if (value === 1) {
        return "男";
      } else if (value === 2) {
        return "未知";
      }
    },
    verifyRole(value) {
      if (value === 0) {
        return "管理员";
      } else if (value === 1) {
        return "商家";
      } else if (value === 2) {
        return "客户";
      }
    },
    verifyState(value) {
      if (value === 0) {
        return "正常";
      } else if (value === 1) {
        return "封禁";
      }
    },
  },
  created() {
    this.getList();
  },
  methods: {
    // 初始化商品表格数据
    getList() {
      this.listLoading = true;
      this.$api.getAllUser(this.listQuery).then((res) => {
        if (res.data) {
          this.list = res.data;
          this.listLoading = false;
          this.total = res.total;
        } else {
          this.$message({
            showClose: true,
            message: "出错了！",
            type: "error",
          });
          console.log(res);
        }
      });
    },
    // 筛选搜索
    handleSearchList() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    // 重置搜索结果
    handleResetSearch() {
      this.selectCateId = [];
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    // 选择框
    handleSelectionChange(val) {
      this.multipleSelection = val.map((item) => item.userId);
    },
    // api start
    // 删除用户req
    deleteUser(userIds) {
      this.$api.delUser(userIds).then((res) => {
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
    },
    // 封禁解封用户
    banUserReq(userIds, state) {
      this.$api.banUser({ userIds, state }).then((res) => {
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
    },
    // 修改用户权限
    changeRoleReq(userId, role) {
      this.$api.changeRole({ userId, role }).then((res) => {
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
    },
    //api end

    // 更改用户角色
    changeRole(row) {
      this.changeRoleReq(row.userId, row.role);
    },
    // // 编辑用户
    // editUser(index, row) {
    //   let userIds = [row.userId];
    //   this.$confirm("是否要进行该操作?", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //   }).then(() => {
    //     console.log(userIds);
    //     // this.checkPro(userIds, 1);
    //   });
    // },
    // 删除用户
    delUser(index, row) {
      let userIds = [row.userId];
      this.$confirm("是否要进行该操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.deleteUser(userIds);
      });
    },
    // 封禁用户
    banUser(index, row) {
      let userIds = [row.userId];
      this.$confirm("是否要进行该操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.banUserReq(userIds, 1);
      });
    },
    // 解封用户
    deblockUser(index, row) {
      let userIds = [row.userId];
      this.$confirm("是否要进行该操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.banUserReq(userIds, 0);
      });
    },

    // 批量操作
    handleBatchOperate() {
      if (this.operateType == null) {
        this.$message({
          message: "请选择操作类型",
          type: "warning",
          duration: 1000,
        });
        return;
      }
      if (this.multipleSelection == null || this.multipleSelection.length < 1) {
        this.$message({
          message: "请选择要操作的商品",
          type: "warning",
          duration: 1000,
        });
        return;
      }
      this.$confirm("是否要进行该批量操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        if (this.operateType === 0) {
          this.banUserReq(this.multipleSelection, 1);
        } else if (this.operateType === 1) {
          this.banUserReq(this.multipleSelection, 0);
        } else if (this.operateType === 2) {
          this.deleteUser(this.multipleSelection);
        }
      });
    },
    // 分页数量改变
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    // 分页页码改变
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
  },
};
</script>

<style lang="scss" scoped>
// 筛选区域
.filter-container {
  font-size: 16px;
  margin-bottom: 20px;
  .search-btn {
    float: right;
  }
  .reset-btn {
    float: right;
    margin-right: 15px;
  }
  .form-box {
    margin-top: 10px;
    .by-keyword {
      width: 191px;
    }
  }
}
.operate-container {
  margin-bottom: 20px;
  font-size: 16px;
  span {
    margin-right: 1100px;
  }
}
.bottom {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}
.dialog-footer {
  display: flex;
  justify-content: space-between;
  .input {
    width: 140px;
  }
}

</style>