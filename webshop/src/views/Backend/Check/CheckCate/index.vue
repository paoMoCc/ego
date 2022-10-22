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
              v-model="listQuery.cateName"
              placeholder="分类名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="分类级别：">
            <el-select v-model="listQuery.cateLv" placeholder="请选择">
              <el-option
                v-for="item in options"
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
        <el-table-column label="编号" align="center">
          <template slot-scope="scope">{{ scope.row.cateId }}</template>
        </el-table-column>
        <el-table-column label="分类级别" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.rootId | verifyLevel }}</p>
          </template>
        </el-table-column>
        <el-table-column label="分类名称" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.cateName }}</p>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <el-tag type="success">正常</el-tag>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <p>
              <el-button
                size="mini"
                type="success"
                @click="checkIt(scope.$index, scope.row)"
                >通过
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="passIt(scope.$index, scope.row)"
                >不通过
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
const defaultListQuery = {
  cateName: null,
  cateLv: null,
  pageNum: 1,
  pageSize: 5,
};
export default {
  data() {
    return {
      // 筛选条件对象
      listQuery: Object.assign({}, defaultListQuery),
      // 分类列表
      list: null,
      listLoading: false,
      //   分类级别配置
      options: [
        {
          value: 0,
          label: "一级分类",
        },
        {
          value: 1,
          label: "二级分类",
        },
      ],
      // 选择框数据
      multipleSelection: [],
      //   批量操作
      operateType: null,
      operates: [
        {
          label: "批量不通过",
          value: 0,
        },
        {
          label: "批量通过",
          value: 1,
        },
      ],
      //   分页数据总数
      total: null,
    };
  },
  filters: {
    verifyLevel(val) {
      if (val === 0) {
        return "一级分类";
      } else {
        return "二级分类";
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
      this.$api.getUncheckedCate(this.listQuery).then((res) => {
        if (res.status === 200) {
          this.list = res.data;
          this.listLoading = false;
          this.total = res.total;
        } else {
          this.$message({
            showClose: true,
            message: res.message,
            type: "error",
          });
          console.log(res);
        }
        console.log(res);
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
      this.multipleSelection = val.map((item) => item.cateId);
    },
    // api start
    // 商品审核req
    checkCate(cateIds, isPassed) {
      this.$api.checkCate({ cateIds, isPassed }).then((res) => {
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
    checkIt(index, row) {
      let cateIds = [row.cateId];
      this.$confirm("是否要进行该操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.checkCate(cateIds, 1);
      });
    },
    passIt(index, row) {
      let cateIds = [row.cateId];
      this.$confirm("是否要进行该操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.checkCate(cateIds, -1);
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
          this.checkCate(this.multipleSelection, -1);
        } else if (this.operateType === 1) {
          this.checkCate(this.multipleSelection, 1);
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