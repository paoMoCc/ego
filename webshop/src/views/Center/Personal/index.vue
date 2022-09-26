<template>
  <div class="personal">
    <el-tabs type="border-card">
      <el-tab-pane class="baseProfile" label="基本资料">
        <div class="detail">
          <div class="tips">
            亲爱的<b>{{ userInfo.userName }}</b
            >,填写真实的资料,有助于好友找到你哦.
          </div>
          <div class="profile">
            <el-form
              ref="form"
              :rules="rules"
              :model="userInfo"
              label-width="80px"
            >
              <!-- 头像 -->
              <el-form-item label="当前头像:">
                <el-avatar
                  class="img"
                  shape="square"
                  :size="80"
                  :src="userImg"
                ></el-avatar>
              </el-form-item>

              <!-- 个人介绍 -->
              <el-form-item label="个人介绍:" prop="introduce">
                <el-input
                  type="textarea"
                  :rows="5"
                  placeholder="介绍下你自己吧~~"
                  v-model="userInfo.introduce"
                >
                </el-input>
              </el-form-item>

              <!-- 昵称 -->
              <el-form-item label="昵称:" prop="nickName">
                <el-input placeholder="请输入昵称" v-model="userInfo.nickName">
                </el-input
              ></el-form-item>

              <!-- 性别 -->
              <el-form-item label="性别:">
                <el-radio v-model="userInfo.sex" :label="0">女</el-radio>
                <el-radio v-model="userInfo.sex" :label="1">男</el-radio>
                <el-radio v-model="userInfo.sex" :label="2">未知</el-radio>
              </el-form-item>

              <!-- 电话号码 -->
              <el-form-item label="电话号码:" prop="phone">
                <el-input placeholder="请输入电话号码" v-model="userInfo.phone">
                </el-input>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="onSubmit">保存</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane class="userAvatar" label="头像照片">
        <!-- action="https://127.0.0.1:8081/my/uploadAvatar" -->
        <!-- 左侧上传区域 -->
        <div class="left">
          <!-- 上传图片 -->
          <div class="upload-box">
            <el-upload
              class="upload-demo"
              :before-upload="beforeAvatarUpload"
              action="http://127.0.0.1:8081/my/uploadAvatar"
              :headers="headers"
              :on-success="handleAvatarSuccess"
              :on-error="handleAvatarErr"
              name="userImg"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                仅支持JPG、GIF、PNG、JPEG格式，文件小于10M
              </div>
            </el-upload>
          </div>
          <!-- 头像 -->
          <div class="img-box">
            <el-avatar
              class="img"
              shape="square"
              :size="150"
              :src="userImg"
            ></el-avatar>
          </div>
        </div>
        <!-- 分割线 -->
        <el-divider direction="vertical"></el-divider>
        <!-- 右侧效果展示 -->
        <div class="display">
          <h3>效果预览</h3>
          <div class="size">
            你上传的图片会自动生成2种尺寸，请注意小尺寸的头像是否清晰
            <div class="large">
              <img :src="userImg" />
              100*100像素
            </div>
            <div class="small">
              <img :src="userImg" />
              50*50像素
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane class="updatePwd" label="修改密码">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="旧密码" prop="oldPass">
            <el-input
              type="password"
              v-model.number="ruleForm.oldPass"
              autocomplete="off"
              show-password
            ></el-input>
          </el-form-item>

          <el-form-item label="新密码" prop="pass">
            <el-input
              type="password"
              v-model="ruleForm.pass"
              autocomplete="off"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input
              type="password"
              v-model="ruleForm.checkPass"
              autocomplete="off"
              show-password
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')"
              >提交</el-button
            >
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <!-- 右侧日历小挂件 -->
    <div class="side-bar">
      <h1>我的日历</h1>
      <div class="content">
        <em>{{ time.day }}</em>
        <span>{{ time.weekDay }}</span>
        <span>{{ time.date }}</span>
      </div>
    </div>
    <!-- 右侧广告 -->
    <img class="ad" src="../../../components/Carousel/images/ad1.png" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import { validNickName, validPhone } from "../../../utils/validate/user";
export default {
  data() {
    const validateNickName = (rule, value, callback) => {
      if (!value) {
        callback(new Error("昵称不能为空哦~~"));
      } else if (!validNickName(value))
        callback(
          new Error("昵称长度需要在1-7个汉字或字符之间，不能包含特殊字符")
        );
      else callback();
    };
    const validatePhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error("电话号码不能为空哦~~"));
      } else if (!validPhone(value)) callback(new Error("11位数字"));
      else callback();
    };
    var validateOldPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入旧密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入新密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("新密码两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      headers: {
        Authorization: this.$store.state.user.token,
      },
      userInfo: {},
      // 规则
      rules: {
        nickName: [
          { validator: validateNickName, required: true, trigger: "blur" },
        ],
        phone: [{ validator: validatePhone, trigger: "blur", required: true }],
      },
      // 修改密码
      ruleForm: {
        pass: "",
        checkPass: "",
        oldPass: "",
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        oldPass: [{ validator: validateOldPass, trigger: "blur" }],
      },
    };
  },
  computed: {
    ...mapState({
      userImg: (state) =>
        state.user.userInfo.userImg
          ? state.user.userInfo.userImg
          : "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
    }),
    time() {
      let time = {};
      time.now = new Date();
      time.day = time.now.getDate();
      time.date = time.now.getFullYear() + "-" + (time.now.getMonth() + 1);
      let weeks = [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
      ];
      time.weekDay = weeks[time.now.getDay()];
      return time;
    },
  },
  methods: {
    // 修改个人信息
    onSubmit() {
      // console.log(this.userInfo);
      let userInfo = {
        introduce: this.userInfo.introduce,
        nickName: this.userInfo.nickName,
        phone: this.userInfo.phone,
        sex: this.userInfo.sex,
      };
      this.$api
        .updateUserInfo(userInfo)
        .then((result) => {
          if (result.status === 200) {
            // 成功之后，重新获取个人信息
            this.$store.dispatch("getMyInfo");
            this.$message({
              showClose: true,
              message: result.message,
              type: "success",
            });
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
    handleAvatarSuccess(res, file) {
      if (res.status === 200) {
        this.$store.dispatch("getMyInfo");
        this.$message({
          showClose: true,
          message: res.message,
          type: "success",
        });
      } else {
        this.$message({
          showClose: true,
          message: res.message,
          type: "error",
        });
      }
    },
    handleAvatarErr(err, file, fileList) {
      this.$message({
        showClose: true,
        message: res.message,
        type: "error",
      });
      console.log(err);
    },

    beforeAvatarUpload(file) {
      const isAvailable =
        file.type === "image/jpeg" || "image/png" || "image/jpg" || "image/gif";
      const isLt10M = file.size / 1024 / 1024 < 10;

      if (!isAvailable) {
        this.$message.error("上传头像图片只能是 JPG、GIF、PNG、JPEG 格式!");
      }
      if (!isLt10M) {
        this.$message.error("上传头像图片大小不能超过 10MB!");
      }
      return isAvailable && isLt10M;
    },
    // 修改密码
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$api
            .resetPassWord({
              oldPassWord: this.ruleForm.oldPass+'',
              newPassWord: this.ruleForm.checkPass+'',
            })
            .then((res) => {
              this.$refs[formName].resetFields();
              if (res.status === 200) {
                // 修改成功后退出登录
                this.$store.commit("CLEAR");
                this.$message({
                  showClose: true,
                  message: res.message,
                  type: "success",
                });
                // 刷新页面
                location.reload();
              } else {
                this.$message({
                  showClose: true,
                  message: res.message,
                  type: "error",
                });
                console.log(res.message);
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
  mounted() {
    this.userInfo = { ...this.$store.state.user.userInfo };
  },
};
</script>

<style lang="scss">
.el-form-item__label {
  font-size: 12px;
  color: #333;
}
</style>

<style lang="scss" scoped>
.personal {
  margin-left: 200px;
  width: 850px;
  // 基本资料
  .baseProfile {
    .tab-sub {
      width: 850px;
    }
    .detail {
      .tips {
        font-size: 15px;
        line-height: 22px;
        margin: 0 0 20px 16px;
        b {
          margin: 0 5px;
          font-weight: bold;
        }
      }
      .profile {
        width: 430px;
      }
    }
  }
  // 用户头像
  .userAvatar {
    height: 450px;
    display: flex;
    justify-content: space-between;
    // 左侧
    .left {
      .upload-box {
        position: absolute;
        top: 40px;
        .el-upload__tip {
          color: #999;
        }
      }

      .img-box {
        width: 450px;
        height: 250px;
        background-color: #f9f9f9;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 120px 0 0 0;
      }
    }
    .el-divider--vertical {
      height: 100%;
    }
    // 右侧
    .display {
      height: 440px;
      width: 250px;
      color: #999;
      .size {
        .large {
          margin: 20px 0;
          img {
            width: 100px;
            height: 100px;
            display: block;
          }
        }
        .small {
          img {
            width: 50px;
            height: 50px;
            display: block;
          }
        }
      }
    }
  }
  // 修改密码
  .updatePwd {
    height: 450px;
  }
  // 右侧日历装饰小挂件
  .side-bar {
    width: 300px;
    height: 200px;
    position: absolute;
    right: 100px;
    top: 130px;
    border: 1px solid #f5f8fa;
    & > *:not(em) {
      font-size: 15px;
    }
    h1 {
      height: 50px;
      font-size: 15px;
      line-height: 50px;
      text-align: center;
      color: #fff;
      background-color: #6ec884;
    }
    .content {
      height: 150px;
      em {
        font-size: 60px;
      }
      color: #6ec884;
      background-color: #f5f7fa;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      flex-direction: column;
    }
  }

  .ad {
    width: 300px;
    // height: 125px;
    position: absolute;
    right: 100px;
    top: 380px;
    border: 1px solid #f5f7fa;
  }
}
</style>