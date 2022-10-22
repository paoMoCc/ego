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
        <el-cascader clearable v-model="selectCateId" :options="cateList" @change="handleCateChange"> </el-cascader>
      </el-form-item>
      <el-form-item label="商品名称：" prop="proName">
        <el-input v-model="value.proName"></el-input>
      </el-form-item>
      <el-form-item label="副标题：" prop="subTitle">
        <el-input v-model="value.subTitle"></el-input>
      </el-form-item>
      <el-form-item label="商品相册">
        <!-- <multi-upload v-model="value.selectProductPics"></multi-upload> -->
        <el-upload
          action="http://127.0.0.1:8081/product/addPro"
          list-type="picture-card"
          :auto-upload="false"
          multiple
          :limit="5"
          :file-list="fileList"
          :on-change="changeFile"
          :http-request="handleHttpRequest"
        >
          <i slot="default" class="el-icon-plus"></i>
          <div slot="file" slot-scope="{ file }">
            <img
              class="el-upload-list__item-thumbnail"
              :src="file.url"
              alt=""
            />
            <span class="el-upload-list__item-actions">
              <span
                class="el-upload-list__item-preview"
                @click="handlePictureCardPreview(file)"
              >
                <i class="el-icon-zoom-in"></i>
              </span>
              <span
                v-if="!disabled"
                class="el-upload-list__item-delete"
                @click="handleRemove(file)"
              >
                <i class="el-icon-delete"></i>
              </span>
            </span>
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <p class="info">最多只能上传五张图片，仅支持.jpg/.jpeg/.gif/.png</p>
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
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
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
      // headers: {
      //   Authorization: this.$store.state.user.token,
      // },
      fileList: [],
      // 表单数据
      value: Object.assign({}, defaultValue),
      //分类列表
      cateList: [],
      // 选中的分类id
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
      //   相册
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
    };
  },
  created() {
    this.getProductCateList();
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
    // 收集图片
    changeFile(file, fileList) {
      let fileName = file.name;
      let regex = /(.jpg|.jpeg|.gif|.png)$/;
      if (regex.test(fileName.toLowerCase())) {
        this.fileList = fileList;
      } else {
        this.$message.error("请选择图片文件");
      }
    },
    // 添加商品请求
    handleHttpRequest() {
      // 通过 FormData 对象上传文件
      const formData = new FormData();
      let obj = { ...this.value };
      Object.keys(obj).forEach((key) => {
        // console.log(key, obj[key]);
        formData.append(key, obj[key]);
      });

      //循环已选择文件列表 fileList，将文件取出放入 formData 的file数组中
      for (let i = 0; i < this.fileList.length; i++) {
        formData.append("productImgs", this.fileList[i].raw);
      }
      this.$api.addPro(formData).then((res) => {
        if (res.status === 200) {
          // 成功上传后清除表单填写数据
          this.selectCateId = null
          this.value = Object.assign({}, defaultValue);
          this.fileList = [];
          this.$message({
            message: res.message,
            type: "success",
            duration: 1000,
          });
        }else{
          this.$message({
            message: res.message,
            type: "error",
            duration: 1000,
          });
          console.log(res);
        }
        
      });
    },
    // 提交
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.handleHttpRequest();
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
    // 移除图片
    handleRemove(file) {
      let index = this.fileList.findIndex((fileItem) => {
        return fileItem.uid === file.uid;
      });
      this.fileList.splice(index, 1);
    },
    // 预览图片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 700px;
  margin: 0 auto;
  padding: 50px;
  border: 1px solid #ccc;
  color: #303133;
  background-color: #fff;
}
.info {
  color: #ccc;
  font-size: 12px;
  // margin-left:;
}
</style>