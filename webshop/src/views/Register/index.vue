<template>
  <div>
    <div class="login">
      <div class="header">
        <span>注册账户</span>
        <el-button round @click="gotoLogin">去登录</el-button>
      </div>

      <el-form
        class="form"
        size="medium"
        :inline="true"
        :label-position="labelPosition"
        label-width="60px"
        :model="form"
        :status-icon="true"
        :show-message="true"
        ref="form"
        :rules="rules"
      >
        <el-form-item prop="userName">
          <el-input
            v-model="form.userName"
            placeholder="请输入您的用户名"
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>
        <el-form-item prop="pass">
          <el-input
            type="password"
            v-model="form.pass"
            autocomplete="off"
            placeholder="请输入您的密码"
            prefix-icon="el-icon-key"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
          <el-input
            type="password"
            v-model="form.checkPass"
            autocomplete="off"
            placeholder="请再次输入您的密码"
            prefix-icon="el-icon-key"
            show-password
          ></el-input>
        </el-form-item>
        <br />
        <el-form-item class="button">
          <el-button type="primary" @click="adminRegist" size="small"
            >管理员注册</el-button
          >
          <el-button type="success" @click="merchantRegist" size="small"
            >商家注册</el-button
          >
          <el-button type="warning" @click="userRegist" size="small"
            >客户注册</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { validUserName, validPassWord } from "../../utils/validate/user";
export default {
  name: "Register",
  data() {
    const validateUserName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入账号"));
      } else if (!validUserName(value))
        callback(new Error("账号只能字母开头，包含数字字母大小写"));
      else callback();
    };
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (!validPassWord(value))
        callback(new Error("密码至少六位，且不能包含空格"));
      else {
        if (this.form.checkPass !== "") {
          this.$refs.form.validateField("checkPass");
        }
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else if (!validPassWord(value))
        callback(new Error("密码至少六位，且不能包含空格"));
      else {
        callback();
      }
    };
    return {
      labelPosition: "left",
      form: {
        userName: "",
        pass: "",
        checkPass: "",
      },
      rules: {
        userName: [
          { validator: validateUserName, trigger: "blur", required: true },
        ],
        pass: [{ validator: validatePass, trigger: "blur", required: true }],
        checkPass: [
          { validator: validatePass2, trigger: "blur", required: true },
        ],
      },
    };
  },
  methods: {
    adminRegist() {
      this.$api.userRegist({
        userName:this.form.userName,
        passWord:this.form.checkPass,
        role:0
      })
        .then((res) => {
          // 登录成功
          if (res.status === 200) {
            this.$router.push("/login");
            this.$message({
              showClose: true,
              message: "注册成功！",
              type: "success",
            });
          } else {
            console.log(res);
            // 清空表单
            this.$refs["form"].resetFields();
            this.$message({
              showClose: true,
              message: res.message,
              type: "error",
            });
          }
        })
        .catch((error) => console.log(error));
    },
    merchantRegist() {
      this.$api
        .userRegist({
          userName: this.form.userName,
          passWord: this.form.checkPass,
          role: 1,
        })
        .then((res) => {
          // 登录成功
          if (res.status === 200) {
            this.$router.push("/login");
            this.$message({
              showClose: true,
              message: "注册成功！",
              type: "success",
            });
          } else {
            console.log(res);
            // 清空表单
            this.$refs["form"].resetFields();
            this.$message({
              showClose: true,
              message: res.message,
              type: "error",
            });
          }
        })
        .catch((error) => console.log(error));
    },
    userRegist() {
      this.$api
        .userRegist({
          userName: this.form.userName,
          passWord: this.form.checkPass,
          role: 2,
        })
        .then((res) => {
          // 登录成功
          if (res.status === 200) {
            this.$router.push("/login");
            this.$message({
              showClose: true,
              message: "注册成功！",
              type: "success",
            });
          } else {
            console.log(res);
            // 清空表单
            this.$refs["form"].resetFields();
            this.$message({
              showClose: true,
              message: res.message,
              type: "error",
            });
          }
        })
        .catch((error) => console.log(error));
    },
    gotoLogin() {
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped lang="scss">
.header {
  margin: -10px 0 20px;
  justify-content: space-around;

  & > * {
    margin: 0 20px;
  }

  & > span {
    font-size: 15px;
    font-weight: bolder;
  }
}
.login {
  width: 300px;
  height: 260px;
  display: flex;
  flex-direction: column;
  z-index: 999;
  margin: 136px auto;
  text-align: center;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 0 8px;

  .form {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .el-input {
      width: 272px;
    }
  }

  & > * {
    justify-content: space-between;
  }

  .button {
    display: flex;
    justify-content: space-between;
  }
}
</style>
