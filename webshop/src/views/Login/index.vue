<template>
  <div class="container">
    <div class="login">
      <div class="header">
        <span>系统登录</span>
        <el-button round @click="gotoRegister">点我注册</el-button>
      </div>

      <el-form
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
        <br />
        <el-form-item prop="passWord">
          <el-input
            v-model="form.passWord"
            type="password"
            placeholder="请输入您的密码"
            prefix-icon="el-icon-key"
            show-password
          ></el-input>
        </el-form-item>
        <br />
        <drag-verify
          :width="drag.width"
          :height="drag.height"
          :text="drag.text"
          :success-text="drag.successText"
          :text-size="drag.textSize"
          class="darg"
          @passcallback="verified = true"
        >
        </drag-verify>
        <el-form-item class="button">
          <el-button
            type="primary"
            @click="adminLogin"
            size="small"
            :disabled="!verified"
            >管理员登录</el-button
          >
          <el-button
            type="success"
            @click="merchantLogin"
            size="small"
            :disabled="!verified"
            >商家登录</el-button
          >
          <el-button
            type="warning"
            @click="userLogin"
            size="small"
            :disabled="!verified"
            >客户登陆</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import dragVerify from "vue-drag-verify";
import { validUserName, validPassWord } from "../../utils/validate/user";
export default {
  data() {
    const validateUserName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入账号"));
      } else if (!validUserName(value))
        callback(new Error("账号只能字母开头，包含数字字母大小写"));
      else callback();
    };
    const validatePassWord = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (!validPassWord(value))
        callback(new Error("密码至少六位，且不能包含空格"));
      else callback();
    };

    return {
      drag: {
        width: 300,
        height: 48,
        text: "请拖动到右侧进行验证",
        successText: "验证成功",
        textSize: "16px",
      },
      verified: false,

      labelPosition: "left",
      form: {
        userName: "",
        passWord: "",
      },
      rules: {
        userName: [
          { validator: validateUserName, trigger: "blur", required: true },
        ],
        passWord: [
          { validator: validatePassWord, trigger: "blur", required: true },
        ],
      },
    };
  },
  components: {
    dragVerify,
  },
  methods: {
    gotoRegister(){
      this.$router.push('/register')
    },
    // 管理员登录
    adminLogin() {
      this.$api.userLogin({
          userName: this.form.userName,
          passWord: this.form.passWord,
          role: 0,
        })
        .then((res) => {
          // 登录成功
          if (res.status === 200) {
            // sessionStorage.setItem("TOKEN", res.token);
            this.$store.commit("USERLOGIN", res.token);
            this.$store.dispatch("getCartList");
            this.$message({
              showClose: true,
              message: "登录成功！",
              type: "success",
            });
            // 一秒后跳转到之前的页面或者去首页
            setTimeout(()=>{
              let path = '/home'
              if(this.$route.query.redirect){
                // 跳转到之前页面
                path = this.$route.query.redirect
              }
              this.$router.push({path:path})
            },1000)
          } else {
            console.log(res);
            // 清空表单
            this.$refs['form'].resetFields();
            this.$message({
              showClose: true,
              message: "登录失败！",
              type: "error",
            });
          }
        })
        .catch((error) => console.log(error));
    },

    // 商家登录
    merchantLogin() {
        this.$api.userLogin({
          userName: this.form.userName,
          passWord: this.form.passWord,
          role: 1,
        })
        .then((res) => {
          // 登录成功
          if (res.status === 200) {
            // sessionStorage.setItem("TOKEN", res.token);
            this.$store.commit("USERLOGIN", res.token);
            this.$store.dispatch("getCartList");
            this.$message({
              showClose: true,
              message: "登录成功！",
              type: "success",
            });
            // 一秒后跳转到之前的页面或者去首页
            setTimeout(()=>{
              let path = '/home'
              if(this.$route.query.redirect){
                // 跳转到之前页面
                path = this.$route.query.redirect
              }
              this.$router.push({path:path})
            },1000)
          } else {
            console.log(res);
            // 清空表单
            this.$refs['form'].resetFields();
            this.$message({
              showClose: true,
              message: "登录失败！",
              type: "error",
            });
          }
        })
        .catch((error) => console.log(error));
    },

    // 用户登录
    userLogin() {
      this.$api.userLogin({
          userName: this.form.userName,
          passWord: this.form.passWord,
          role: 2,
        })
        .then((res) => {
          // 登录成功
          if (res.status === 200) {
            // sessionStorage.setItem("TOKEN", res.token);
            this.$store.commit("USERLOGIN", res.token);
            this.$store.dispatch("getCartList");
            this.$message({
              showClose: true,
              message: "登录成功！",
              type: "success",
            });
            // 一秒后跳转到之前的页面或者去首页
            setTimeout(()=>{
              let path = '/home'
              if(this.$route.query.redirect){
                // 跳转到之前页面
                path = this.$route.query.redirect
              }
              this.$router.push({path:path})
            },1000)
          } else {
            console.log(res);
            // 清空表单
            this.$refs['form'].resetFields();
            this.$message({
              showClose: true,
              message: "登录失败！",
              type: "error",
            });
          }
        })
        .catch((error) => console.log(error));
    },
  },
};
</script>

<style scoped lang="scss">
 .container {
  width: 100%;
  height: 723px;
  background: url("../../assets/1.png") no-repeat center;
  background-size: 100% 100%;
  position: absolute;
  z-index: 1;
} 
.header{
  margin: -10px 0 20px;
  justify-content: space-around;

  &>*{
    margin: 0 20px;
  }

  &>span{
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
  background-color: rgba($color: #fff, $alpha: 0.1);

  &>*{
  justify-content: space-between;

  }
  
  .el-input{
      width: 272px;
    }
}

.darg {
  margin: 0 auto;
  margin-bottom: 20px;
}

.button {
  display: flex;
  justify-content: space-between;
}
</style>
