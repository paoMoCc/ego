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
              v-model="listQuery.keyWord"
              placeholder="商品名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="商品分类：">
            <el-cascader
              clearable
              v-model="selectCateId"
              :options="cateList"
              @change="handleCateChange"
            >
            </el-cascader>
          </el-form-item>
          <el-form-item label="上架状态：">
            <el-select v-model="listQuery.status" placeholder="全部" clearable>
              <el-option
                v-for="item in publishStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核状态：">
            <el-select
              v-model="listQuery.isPassed"
              placeholder="全部"
              clearable
            >
              <el-option
                v-for="item in verifyStatusOptions"
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
    <!-- 中部添加商品操作 -->
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button class="btn-add" @click="handleAddProduct()" size="mini">
        添加
      </el-button>
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
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.proId }}</template>
        </el-table-column>
        <el-table-column label="商品图片" width="150" align="center">
          <template slot-scope="scope"
            ><img
              style="height: 120px; width: 120px"
              :src="`http://127.0.0.1:8081/productImgs/${scope.row.productImgs.split(
                '@',
                1
              )}`"
            />
          </template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.proName }}</p>
          </template>
        </el-table-column>
        <el-table-column label="价格" width="120" align="center">
          <template slot-scope="scope">
            <p>￥{{ scope.row.price }}</p>
          </template>
        </el-table-column>
        <el-table-column label="标签" width="140" align="center">
          <template slot-scope="scope">
            <p>
              上架：
              <el-switch
                @change="handlePublishStatusChange(scope.$index, scope.row)"
                :active-value="1"
                :inactive-value="0"
                v-model="scope.row.status"
              >
              </el-switch>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="库存" width="100" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.stock }}</p>
          </template>
        </el-table-column>
        <el-table-column label="修改库存" width="100" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="handleShowSkuEditDialog(scope.$index, scope.row)"
              circle
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" width="100" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.isPassed | verifyStatusFilter }}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="scope">
            <p>
              <el-button
                size="mini"
                @click="handleUpdateProduct(scope.$index, scope.row)"
                >编辑
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
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

      <!-- 修改库存对话框 -->
      <el-dialog title="修改库存" :visible.sync="dialogVisible">
        <!-- 内容区域 -->
        <el-table :data="modifiedPro">
          <el-table-column label="商品图片" width="150" align="center">
            <template slot-scope="scope"
              ><img
                style="height: 120px; width: 120px; border-radius: 8px"
                :src="`http://127.0.0.1:8081/productImgs/${scope.row.productImgs.split(
                  '@',
                  1
                )}`"
              />
            </template>
          </el-table-column>
          <el-table-column label="商品名称" width="300" align="center">
            <template slot-scope="scope">
              <p>{{ scope.row.proName }}</p>
            </template>
          </el-table-column>
          <el-table-column label="库存" align="center">
            <template slot-scope="scope">
              <p>{{ scope.row.stock }}</p>
            </template>
          </el-table-column>
        </el-table>
        <!-- 底部操作区域 -->
        <el-form
          :model="form"
          :rules="rules"
          ref="productInfoForm"
          label-width="60px"
          size="small"
          slot="footer"
          class="dialog-footer"
        >
          <el-form-item label="库存" prop="stock">
            <el-input
              v-model.number="form.stock"
              autocomplete="off"
              class="input"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <div class="btns">
              <el-button @click="hideDialog">取 消</el-button>
              <el-button type="primary" @click="updateStock('productInfoForm')"
                >确 定</el-button
              >
            </div>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import toTree from "@/utils/arrayToTree";
const defaultListQuery = {
  keyWord: null,
  status: null,
  isPassed: null,
  cateId: null,
  pageNum: 1,
  pageSize: 5,
};
export default {
  data() {
    const validateStock = (rule, value, callback) => {
      if (!value) {
        callback(new Error("库存不能为空！"));
      } else if (!Number.isInteger(value)) {
        callback(new Error("请输入整数！"));
      } else if (value.toString().length > 3) {
        callback(new Error("请输入三位数以内整数！"));
      } else callback();
    };
    return {
      // 筛选条件对象
      listQuery: Object.assign({}, defaultListQuery),
      // 选中的分类id
      selectCateId: null,
      cateList: [],
      publishStatusOptions: [
        {
          value: 1,
          label: "上架",
        },
        {
          value: 0,
          label: "下架",
        },
      ],
      verifyStatusOptions: [
        {
          value: 1,
          label: "审核通过",
        },
        {
          value: 0,
          label: "未审核",
        },
      ],
      //   选择框数据
      multipleSelection: [],
      //   商品列表
      list: null,
      listLoading: false,
      //   批量操作
      operateType: null,
      operates: [
        {
          label: "商品上架",
          value: "publishOn",
        },
        {
          label: "商品下架",
          value: "publishOff",
        },
        // {
        //   label: "转移到分类",
        //   value: "transferCategory",
        // },
        {
          label: "移入回收站",
          value: "recycle",
        },
      ],
      //   分页数据总数
      total: null,
      dialogVisible: false,
      form: {
        stock: null,
      },
      rules: {
        stock: [
          // { required: true, message: "库存不能为空！", trigger: "blur" },
          { validator: validateStock, trigger: "blur", required: true },
          { type: "number", message: "库存数字值" },
        ],
      },
      modifiedPro: [],
    };
  },
  filters: {
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
    this.getProductCateList();
  },
  methods: {
    // 选中分类
    handleCateChange(val) {
      this.listQuery.cateId = val[1];
    },
    // 初始化商品表格数据
    getList() {
      this.listLoading = true;
      this.$api.fetchList(this.listQuery).then((res) => {
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
        this.cateList = toTree(arr);
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
    // 添加商品
    handleAddProduct() {
      this.$router.push({ path: "/backend/addPro" });
    },
    // 选择框
    handleSelectionChange(val) {
      this.multipleSelection = val.map((item) => item.proId);
    },
    // 修改库存按钮
    handleShowSkuEditDialog(index, row) {
      this.dialogVisible = true;
      this.modifiedPro.push(row);
    },
    // 隐藏dialog/取消按钮
    hideDialog() {
      this.modifiedPro = [];
      this.form.stock = null;
      this.dialogVisible = false;
    },
    // dialog内修改库存/确定按钮
    updateStock(formName) {
      let proId = this.modifiedPro[0].proId;
      let stock = this.form.stock;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // this.$emit("nextStep");
          this.$api.changeProStock({ proId, stock }).then((res) => {
            if (res.status === 200) {
              this.$message({
                message: res.message,
                type: "success",
                duration: 1000,
              });
              this.hideDialog()
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
        } else {
          this.$message({
            message: "验证失败",
            type: "error",
            duration: 1000,
          });
          return false;
        }
      });
    },
    // 上架下架商品switch按钮
    handlePublishStatusChange(index, row) {
      let proIds = [];
      proIds.push(row.proId);
      this.updatePublishStatus({ status: row.status, proIds });
    },
    // 编辑商品信息按钮
    handleUpdateProduct(index, row) {
        this.$router.push({ path: "/backend/updatePro", query: { proId: row.proId } });
    },

    // 删除商品按钮
    handleDelete(index, row) {
      this.$confirm("是否要进行删除操作?", "此操作不可逆", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let proIds = [];
        proIds.push(row.proId);
        this.updateDeleteStatus(proIds);
      });
    },

    // api start
    // 上下架/批量上下架
    updatePublishStatus(data) {
      this.$api.changeProState(data).then((res) => {
        if (res.status === 200) {
          this.$message({
            message: res.message,
            type: "success",
            duration: 1000,
          });
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
    // 删除商品/批量删除商品
    updateDeleteStatus(proIds) {
      this.$api.delPro(proIds).then((res) => {
        if (res.status === 200) {
          this.$message({
            message: res.message,
            type: "success",
            duration: 1000,
          });
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
        let proIds = this.multipleSelection;
        switch (this.operateType) {
          // 上架
          case this.operates[0].value:
            this.updatePublishStatus({ status: 1, proIds });
            break;
          // 下架
          case this.operates[1].value:
            this.updatePublishStatus({ status: 0, proIds });
            break;
          case this.operates[2].value:
            this.updateDeleteStatus(proIds);
            break;
          default:
            break;
        }
        this.getList();
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