<template>
  <div class="container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">数据列表</span>
      <el-button class="btn-add" @click="handleAddProductCate()" size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table
        ref="productCateTable"
        style="width: 100%"
        :data="list"
        v-loading="listLoading"
        border
      >
        <el-table-column label="编号" width="120" align="center">
          <template slot-scope="scope">{{ scope.row.cateId }}</template>
        </el-table-column>
        <el-table-column label="分类名称" align="center">
          <template slot-scope="scope">{{ scope.row.cateName }}</template>
        </el-table-column>
        <el-table-column label="级别" width="120" align="center">
          <template slot-scope="scope">{{
            scope.row.rootId | levelFilter
          }}</template>
        </el-table-column>
        <el-table-column
          label="子类数量"
          width="120"
          align="center"
          v-if="!rootId"
        >
          <template slot-scope="scope">{{
            childNum(scope.row.cateId)
          }}</template>
        </el-table-column>
        <el-table-column label="商品数量" width="120" align="center" v-else>
          <template slot-scope="scope">{{ proNum(scope.row.cateId) }}</template>
        </el-table-column>
        <el-table-column label="数量单位" width="120" align="center">
          <p>个</p>
        </el-table-column>
        <el-table-column label="审核状态" width="120" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.isPassed | verifyStatusFilter }}</p>
          </template>
        </el-table-column>
        <el-table-column label="设置" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="!rootId"
              :disabled="!childNum(scope.row.cateId)"
              size="mini"
              @click="handleShowNextLevel(scope.$index, scope.row)"
              >查看下级
            </el-button>
            <el-button
              v-else
              size="mini"
              @click="goBack(scope.$index, scope.row)"
              >返回上级
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center" v-if="isAdmin">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleUpdate(scope.$index, scope.row)"
              >编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
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

    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="ruleForm">
        <el-form-item label="分类等级" label-width="120px">
          <el-select v-model="cateLevel" placeholder="请选择分类等级">
            <el-option label="一级分类" :value="0"></el-option>
            <el-option label="二级分类" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品分类：" label-width="120px">
          <el-cascader
            clearable
            :disabled="!cateLevel"
            v-model="selectCateId"
            :options="cateList"
            @change="handleCateChange"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="分类名称" label-width="120px">
          <el-input
            v-model="form.cateName"
            autocomplete="off"
            style="width: 203px"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAction">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "productCateList",
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 5,
      },
      rootId: 0,
      childList: null,
      proList: null,
      dialogFormVisible: false,
      // dialog操作类型
      actionType: null,
      // dialog中分类级别
      cateLevel: null,
      form: {
        rootId: 0,
        cateNme: null,
      },
      // 选中的分类id
      selectCateId: null,
      cateList: [],
    };
  },
  filters: {
    levelFilter(value) {
      if (value === 0) {
        return "一级";
      } else {
        return "二级";
      }
    },
    verifyStatusFilter(value) {
      if (value === 1) {
        return "已通过";
      } else if (value === 0) {
        return "待审核";
      } else if (value === -1) {
        return "未通过";
      }
    },
  },
  created() {
    this.getList();
  },
  computed: {
    ...mapGetters(["isAdmin"]),
    childNum: function () {
      // `this` 指向 vm 实例
      return (parameter) => {
        let arr = this.childList.filter(
          (item) => item.rootId === parameter * 1
        );
        return arr.length;
      };
    },
    proNum: function () {
      // `this` 指向 vm 实例
      return (parameter) => {
        let arr = this.proList.filter((item) => item.cateId === parameter * 1);
        return arr.length;
      };
    },
    dialogTitle() {
      if (this.actionType === "add") return "添加分类";
      if (this.actionType === "update") return "编辑分类";
    },
  },
  methods: {
    resetParentId(id) {
      this.listQuery.pageNum = 1;
      this.list = null;
      this.total = null;
      this.childList = null;
      this.proList = null;
      this.rootId = 0;
      this.rootId = id;
    },
    // 获取分类数据
    getProductCateList() {
      this.$api.getCate().then((res) => {
        let arr = res.data.map((item) => {
          return {
            value: item.cateId,
            label: item.cateName,
            rootId: item.rootId,
            cateId: item.cateId,
          };
        });
        this.cateList = arr.filter((item) => item.rootId === 0);
      });
    },
    getList() {
      this.listLoading = true;
      this.$api
        .getCateByRootId({
          rootId: this.rootId,
          pageNum: this.listQuery.pageNum,
          pageSize: this.listQuery.pageSize,
        })
        .then((res) => {
          this.listLoading = false;
          this.list = res.data;
          this.total = res.total;
          this.childList = res.childList;
          this.proList = res.proList;
        });
    },
    // 添加分类请求
    addCateReq() {
      this.$api.addCate(this.form).then((res) => {
        if (res.status === 200) {
          this.$message({
            message: res.message,
            type: "success",
            duration: 1000,
          });
          this.cancelAction();
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
    // 编辑分类请求
    updateCateReq() {
      this.$api.updateCate(this.form).then((res) => {
        if (res.status === 200) {
          this.$message({
            message: res.message,
            type: "success",
            duration: 1000,
          });
          this.cancelAction();
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
    // 选中分类
    handleCateChange(val) {
      this.form.rootId = val[0];
    },
    // 添加分类按钮
    handleAddProductCate() {
      this.actionType = "add";
      this.dialogFormVisible = true;
      this.getProductCateList();
    },
    // dialog按钮操作
    cancelAction() {
      this.cateLevel = null;
      this.form.rootId = 0;
      this.selectCateId = null;
      this.form.cateName = null;
      this.cateList = [];
      this.dialogFormVisible = false;
    },
    submit() {
      if (this.actionType === "add") {
        this.addCateReq();
      } else if (this.actionType === "update") {
        this.updateCateReq();
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
    // 查看下级分类
    handleShowNextLevel(index, row) {
      this.resetParentId(row.cateId);
      this.getList();
    },
    // 返回上级分类
    goBack(index, row) {
      this.resetParentId(0);
      this.getList();
    },
    // 编辑分类
    async handleUpdate(index, row) {
      this.actionType = "update";
      this.dialogFormVisible = true;
      await this.getProductCateList();
      let res = await this.$api.getCateByCateId(row.cateId);
      if (res.status === 200) {
        this.form = res.data;
        this.cateLevel = res.data.rootId === 0 ? 0 : 1;
        this.selectCateId = [res.data.rootId];
      } else console.log(res);
    },
    // 删除分类
    handleDelete(index, row) {
      this.$confirm("是否要删除该分类", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$api.delCate(row.cateId).then((res) => {
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
.container {
  .operate-container {
    font-size: 16px;
    margin-bottom: 20px;
    span {
      margin-right: 1100px;
    }
  }
  .pagination-container {
    margin-top: 20px;
    float: right;
  }
}
</style>
