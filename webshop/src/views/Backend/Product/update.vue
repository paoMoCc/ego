<template>
  <div class="container">
    <el-form
      :model="value"
      :rules="rules"
      ref="productInfoForm"
      label-width="120px"
      style="width: 600px"
      size="small"
    >
      <el-form-item label="商品分类：" prop="cateId">
        <el-cascader
          clearable
          v-model="selectCateId"
          :options="cateList"
          @change="handleCateChange"
        >
        </el-cascader>
      </el-form-item>
      <el-form-item label="商品名称：" prop="proName">
        <el-input v-model="value.proName"></el-input>
      </el-form-item>
      <el-form-item label="副标题：" prop="subTitle">
        <el-input v-model="value.subTitle"></el-input>
      </el-form-item>
      <el-form-item label="商品介绍：" prop="detail">
        <el-input
          :autoSize="true"
          v-model="value.detail"
          type="textarea"
          placeholder="请输入内容"
        ></el-input>
      </el-form-item>
      <el-form-item label="商品售价：" prop="price">
        <el-input v-model="value.price"></el-input>
      </el-form-item>
      <el-form-item label="商品库存：" prop="stock">
        <el-input v-model.number="value.stock"></el-input>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button
          type="primary"
          size="medium"
          @click="handleSubmit('productInfoForm')"
          >提交</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import toTree from "@/utils/arrayToTree";
const defaultValue = {
  cateId: null,
  proName: null,
  subTitle: null,
  detail: null,
  price: null,
  stock: null,
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
      // 表单数据
      value: Object.assign({}, defaultValue),
      //分类列表
      cateList: [],
      selectCateId: null,
      rules: {
        cateId: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
        proName: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
          {
            min: 2,
            max: 140,
            message: "长度在 2 到 140 个字符",
            trigger: "blur",
          },
        ],
        subTitle: [
          { required: true, message: "请输入商品副标题", trigger: "blur" },
        ],
        detail: [
          { required: true, message: "请输入商品介绍", trigger: "blur" },
        ],
        price: [{ required: true, message: "请输入商品价格", trigger: "blur" }],
        stock: [
          { validator: validateStock, trigger: "blur", required: true },
          { type: "number", message: "库存数字值" },
        ],
      },
    };
  },
  created() {
    this.getProductCateList();
    let proId = this.$route.query.proId * 1;
    this.getData(proId);
  },
  methods: {
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
    // 选中分类
    handleCateChange(val) {
      this.value.cateId = val[1];
      console.log(this.value);
    },
    // 根据id获取商品信息
    getData(proId) {
      this.$api.getProById(proId).then((res) => {
        if (res.status === 200) {
          this.value = res.data;
          this.selectCateId = [res.data.rootId, res.data.cateId];
        }
      });
    },
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$api
            .updatePro({
              proId: this.$route.query.proId * 1,
              value: this.value,
            })
            .then((res) => {
              if (res.status === 200) {
                this.$message({
                  message: res.message,
                  type: "success",
                  duration: 1000,
                });
                setTimeout(() => {
                  this.value = defaultValue;
                  this.$router.push({ path: "/backend/proList" });
                }, 1000);
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
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 700px;
  margin: 100px auto 0;
  padding: 50px;
  border: 1px solid #ccc;
  color: #303133;
  background-color: #fff;
}
</style>