<template>
  <div class="address">
    <div class="h1">
      <span>收货地址</span
      ><span
        >已保存了<span>{{ tableData.length }}</span
        >条地址</span
      >
    </div>

    <div class="container">
      <!-- 左侧表单 -->
      <div class="left">
        <!-- 左侧上部标题 -->
        <div class="top">
          <div class="h2">新增收货地址</div>
          <div class="sendEara">
            <span>当前配送至</span>
            <span>{{ value }}</span>
          </div>
        </div>
        <!-- 左侧下部表单 -->
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="地址信息" prop="address">
            <el-cascader
              :options="options1"
              @change="handleChange"
              v-model="ruleForm.address"
            >
            </el-cascader>
          </el-form-item>

          <el-form-item label="详细地址" prop="detailAdd">
            <el-input placeholder="请输入详细地址" v-model="ruleForm.detailAdd">
            </el-input>
          </el-form-item>

          <el-form-item label="收货人姓名" prop="name">
            <el-input
              placeholder="请输入收货人姓名"
              v-model="ruleForm.name"
            ></el-input>
          </el-form-item>

          <el-form-item label="手机号码" prop="phone">
            <div class="phoneNum">
              <el-select v-model="value">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <el-input
                placeholder="请输入电话号码"
                v-model="ruleForm.phone"
              ></el-input>
            </div>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              v-if="isModifying"
              @click="modifyAdd('ruleForm')"
              >修改</el-button
            >
            <el-button type="primary" v-else @click="submitForm('ruleForm')"
              >保存</el-button
            >
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 右侧地址表格 -->
      <div class="right">
        <el-table
          :data="tableData"
          height="470"
          border
          style="width: 767px"
          :header-cell-style="{ 'text-align': 'center' }"
          :cell-style="{ 'text-align': 'center' }"
        >
          <el-table-column prop="name" label="收货人" width="70">
          </el-table-column>
          <el-table-column prop="area" label="所在地区" width="120">
          </el-table-column>
          <el-table-column prop="detailAdd" label="详细地址" width="200">
          </el-table-column>
          <el-table-column label="邮编" width="100">
            <template>
              <div>000000</div>
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="电话/手机" width="150">
          </el-table-column>
          <el-table-column label="操作" width="110">
            <template slot-scope="scope">
              <div class="action">
                <span @click="modify(scope.row)">修改</span>|<span
                  @click="deleteAdd(scope.row)"
                  >删除</span
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { regionData, CodeToText, TextToCode } from "element-china-area-data";
import {
  validDetailAdd,
  validName,
  validPhone,
} from "../../../utils/validate/address";
import { mapState } from "vuex";
export default {
  data() {
    const validateDetailAdd = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入详细地址"));
      } else if (!validDetailAdd(value))
        callback(
          new Error("详细地址长度需要在5-50个汉字或字符，不能包含表情符号")
        );
      else callback();
    };
    const validateName = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入收货人姓名"));
      } else if (!validName(value))
        callback(
          new Error(
            "收货人姓名长度需要在2-10个汉字或字符之间，不能包含特殊字符"
          )
        );
      else callback();
    };
    const validatePhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入电话号码"));
      } else if (!validPhone(value)) callback(new Error("11位数字"));
      else callback();
    };
    return {
      options1: regionData,
      // 表单数据
      ruleForm: {
        address: [],
        area: "",
        detailAdd: "",
        name: "",
        phone: "",
      },
      // 规则
      rules: {
        address: [
          {
            required: true,
            message: "请选择地址信息",
            trigger: "change",
          },
        ],
        detailAdd: [
          { validator: validateDetailAdd, trigger: "blur", required: true },
        ],
        name: [{ validator: validateName, trigger: "blur", required: true }],
        phone: [{ validator: validatePhone, trigger: "blur", required: true }],
      },
      // 手机号左侧地区下拉框配置
      options: [
        {
          value: "中国大陆",
          label: "中国大陆 +86",
        },
        {
          value: "中国台湾",
          label: "中国台湾 +886",
        },
        {
          value: "中国香港",
          label: "中国香港 +852",
        },
        {
          value: "中国澳门",
          label: "中国澳门 +853",
        },
      ],
      // 手机号左侧地区栏默认值
      value: "中国大陆",
      // 是否处于修改状态
      isModifying: false,
    };
  },
  computed: {
    ...mapState({
      tableData: (state) => state.order.address,
    }),
  },
  methods: {
    // 解析地址
    handleChange(value) {
      if (value[1] != null && value[2] != null) {
        let dz = "";
        dz = `${CodeToText[value[0]]}-${CodeToText[value[1]]}-${
          CodeToText[value[2]]
        }`;
        this.ruleForm.area = dz;
      }
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.isModifying = false;
    },
    // 修改地址(按钮)
    modifyAdd(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let form = this.ruleForm;
          this.$api
            .updateAddress(form)
            .then((result) => {
              if (result.status === 200) {
                // 成功之后重新获取收货地址列表
                this.$store.dispatch("getMyAddress");
                this.resetForm("ruleForm");
              } else {
                this.$message({
                  showClose: true,
                  message: res.message,
                  type: "error",
                });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 新增地址 (按钮)
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let form = this.ruleForm;
          this.$api
            .addAddress(form)
            .then((result) => {
              if (result.status === 200) {
                // 成功之后重新获取收货地址列表
                this.$store.dispatch("getMyAddress");
              } else {
                this.$message({
                  showClose: true,
                  message: result.message,
                  type: "error",
                });
              }
              // 清空表单
              this.resetForm("ruleForm");
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 修改(表格)
    modify(item) {
      // 开启加载状态
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      // 开启修改状态
      this.isModifying = true;

      let form = this.ruleForm;
      let arr = item.area.split("-");
      form.addressId = item.addressId;
      form.address = TextToCode[arr[0]][arr[1]][arr[2]].code;
      form.area = item.area;
      form.name = item.name;
      form.phone = item.phone;
      form.detailAdd = item.detailAdd;
      // 关闭加载状态
      setTimeout(() => {
        loading.close();
      }, 500);
    },
    // 删除(表格)
    deleteAdd(item) {
      this.$api
        .deleteAddress(item.addressId)
        .then((result) => {
          if (result.status === 200) {
            // 删除成功之后重新获取收货地址列表
            this.$store.dispatch("getMyAddress");
          } else {
            this.$message({
              showClose: true,
              message: result.message,
              type: "error",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted() {
    this.$store.dispatch("getMyAddress");
  },
};
</script>
<style lang="scss">
.demo-ruleForm {
  & > * {
    width: 470px;
    margin: 30px 0px;
  }
  .phoneNum {
    display: flex;
    & > :first {
      margin-right: 5px;
    }
  }
  .el-select .el-input__inner {
    font-size: 5px;
  }
  // 表单字体
  .el-form-item__label {
    font-size: 12px;
  }
  // 表格内字体
  .el-table {
    font-size: 12px;
  }
}
</style>
<style lang="scss" scoped>
.address {
  margin-left: 160px;
  width: 1200px;
  .h1 {
    width: 1240px;
    font-size: 15px;
    background-color: #f3f8fe;
    color: #014d7f;
    padding-left: 30px;
    line-height: 30px;
    margin-bottom: 10px;
    & > :first-child {
      margin-right: 410px;
    }
  }
  .container {
    display: flex;
    .left {
      margin-right: 13px;
      padding: 20px 20px 0 0;
      background-color: #f5f5f5;
      .top {
        & > * {
          line-height: 30px;
          margin: 10px 0 0 0;
        }
        .h2 {
          color: #ff5000;
          margin: 0px 30px;
        }
        .sendEara {
          width: 450px;
          margin-left: 20px;
          background-color: #fff;
          span {
            line-height: 30px;
            margin: 0 10px;
          }
          & > :last-child {
            font-weight: bold;
          }
        }
      }
    }
    .right {
      // float: right;
      .action {
        display: flex;
        justify-content: space-around;
        span:hover {
          text-decoration: underline;
          color: #ff5000;
          cursor: pointer;
        }
      }
    }
  }
}
</style>