<template>
  <div class="pay-main">
    <SearchBar></SearchBar>
    <div class="pay-container">
      <div class="checkout-tit">
        <h4 class="tit-txt">
          <span class="success-icon"></span>
          <span class="success-info"
            >订单提交成功，请您及时付款，以便尽快为您发货~~</span
          >
        </h4>
        <div class="paymark">
          <span class="fl"
            >请您在提交订单<em class="orange time">4小时</em
            >之内完成支付，超时订单会自动取消。</span
          >
          <span class="fr"
            ><em class="lead">应付金额：</em
            ><em class="orange money"
              >￥{{ $route.params.total.toFixed(2) }}</em
            ></span
          >
        </div>
      </div>
      <div class="checkout-info">
        <h4>重要说明：</h4>
        <ol>
          <li>
            易购商城支付平台目前仅支持<span class="zfb">支付宝，微信</span
            >支付方式。
          </li>
          <li>其它支付渠道正在调试中，敬请期待。</li>
          <li>为了保证您的购物支付流程顺利完成，请尽快完成支付。</li>
        </ol>
        <h4>默认选择支付宝支付</h4>
      </div>
      <div class="checkout-steps">
        <div class="step-tit">
          <h5>支付平台</h5>
        </div>
        <div class="step-cont">
          <ul class="payType">
            <li @click="choseIt(2)" :class="payForm === 2 ? 'active' : ''">
              <img src="./images/pay2.jpg" />
            </li>
            <li @click="choseIt(1)" :class="payForm === 1 ? 'active' : ''">
              <img src="./images/pay3.jpg" />
            </li>
          </ul>
        </div>
        <div class="hr"></div>

        <div class="payshipInfo">
          <div class="step-tit">
            <h5>支付网银</h5>
          </div>
          <div class="step-cont">
            <ul class="payType">
              <li><img src="./images/pay10.jpg" /></li>
              <li><img src="./images/pay11.jpg" /></li>
              <li><img src="./images/pay12.jpg" /></li>
              <li><img src="./images/pay13.jpg" /></li>
              <li><img src="./images/pay14.jpg" /></li>
              <li><img src="./images/pay15.jpg" /></li>
              <li><img src="./images/pay16.jpg" /></li>
              <li><img src="./images/pay17.jpg" /></li>
              <li><img src="./images/pay18.jpg" /></li>
              <li><img src="./images/pay19.jpg" /></li>
              <li><img src="./images/pay20.jpg" /></li>
              <li><img src="./images/pay21.jpg" /></li>
              <li><img src="./images/pay22.jpg" /></li>
            </ul>
          </div>
        </div>
        <div class="hr"></div>

        <div class="otherpay">
          <div class="step-tit">
            <h5>其他支付方式</h5>
          </div>
          <div class="step-cont">
            <span>中国银联</span>
            <span>信用卡</span>
          </div>
        </div>

        <div class="submit">
          <a class="btn" @click="show">立即支付</a>
        </div>
      </div>
    </div>
    <el-dialog title="正在使用支付宝支付" :visible.sync="dialogVisible">
      <div class="topBox">
        <p class="title">正在使用即时到账交易</p>
        <div class="infoBox">
          <p><span style="font-size:13px;margin-right:10px;font-weight:bolder">测试</span><span>收款方：沙盒环境</span></p>
          <p>
            <span style="color:red;font-size:16px;font-weight:bolder">{{ $route.params.total.toFixed(2) }}</span
            > 元
          </p>
        </div>
      </div>
      <div class="payBox">
        <div><img class="img" src="./images/付款页面.png" alt="" /></div>

        <div class="line"></div>

        <div class="right">
          <div class="rightOne rightFlex">
            <span>登录支付宝账户付款</span
            ><span style="font-size: 13px; color: skyblue">新用户注册</span>
          </div>
          <div class="rightTow">
            <div class="rightFlex">
              <span>账户名：</span><span>忘记账户名？</span>
            </div>
            <div>
              <el-input
                v-model.trim="acount"
                placeholder="手机号/邮箱"
                :maxlength="11"
              ></el-input>
            </div>
          </div>
          <div class="rightThree">
            <div class="rightFlex">
              <span>支付密码：</span><span>忘记密码？</span>
            </div>
            <el-input
              v-model.trim="passWord"
              show-password
              :maxlength="6"
            ></el-input>
            <p class="tips">
              请输入账户的<span style="color: red">支付密码</span
              >,不是登录密码。
            </p>
            <div class="rightFlex">
              <el-button @click="cancelPay">取消支付</el-button>
              <el-button type="primary" @click="payMoney">确定支付</el-button>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import SearchBar from "@/components/SearchBar";
// import QRCode from "qrcode";
export default {
  name: "Pay",
  components: { SearchBar },
  data() {
    return {
      acount: undefined,
      passWord: undefined,
      //支付状态码
      payForm: 2,
      dialogVisible: false,
      rules: {},
    };
  },
  computed: {},
  mounted() {
    // console.log(this.$route.params);
  },
  methods: {
    choseIt(num) {
      this.payForm = num;
    },
    show(){
      this.dialogVisible = true
    },
    resetAndHide() {
      this.dialogVisible = false;
      this.acount = undefined;
      this.passWord = undefined;
    },
    cancelPay(){
      this.resetAndHide()
    },
    // 支付
    payMoney() {
      let param = this.$route.params;
      this.$confirm("确定要支付吗？", "确认支付", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const loading = this.$loading({
            lock: true,
            text: "支付中...",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
          });
          // 立即购买成功
          if (param.buyNow) {
            this.$api
              .buyNow({
                proId: param.product.proId * 1,
                price: param.product.price * 1,
                quantity: param.product.quantity * 1,
                productImgs: param.product.productImgs,
                addressId: param.addressId * 1,
                payForm: this.payForm,
                payStatus: 1,
              })
              .then((res) => {
                if (res.status === 200) {
                  setTimeout(() => {
                    this.resetAndHide();
                    loading.close();
                    this.$router.replace("/paySuccess");
                  }, 2000);
                } else {
                  this.$message({
                    type: "error",
                    message: res.message,
                  });
                  console.log(res.message);
                }
              });
          } else if (param.repay) {
            // 重新支付成功
            this.$api
              .repay({
                orderId: param.checkList[0].orderId * 1,
                payForm: this.payForm,
                payStatus: 1,
              })
              .then((res) => {
                if (res.status === 200) {
                  setTimeout(() => {
                    this.resetAndHide();
                    loading.close();
                    this.$router.replace("/paySuccess");
                  }, 2000);
                } else {
                  this.$message({
                    type: "error",
                    message: res.message,
                  });
                }
              });
          } else {
            // 正常流程支付成功
            this.$api
              .pay({
                cartIds: param.cartIds,
                addressId: param.addressId,
                payForm: this.payForm,
                payStatus: 1,
              })
              .then((res) => {
                if (res.status === 200) {
                  setTimeout(() => {
                    this.resetAndHide();
                    loading.close();
                    this.$router.replace("/paySuccess");
                  }, 2000);
                } else {
                  this.$message({
                    type: "error",
                    message: res.message,
                  });
                }
              });
          }
        })
        .catch(() => {
          // 立即购买支付失败;
          if (param.buyNow) {
            this.$api
              .buyNow({
                proId: param.product.proId * 1,
                price: param.product.price * 1,
                quantity: param.product.quantity * 1,
                productImgs: param.product.productImgs,
                addressId: param.addressId * 1,
                payForm: this.payForm,
                payStatus: 0,
              })
              .then((res) => {
                if (res.status === 100) {
                  this.$message({
                    type: "info",
                    message: res.message,
                  });
                  setTimeout(() => {
                    location.reload();
                  }, 2000);
                } else {
                  this.$message({
                    type: "error",
                    message: res.message,
                  });
                  console.log(res.message);
                }
              });
          } else if (param.repay) {
            // 重新支付失败
            this.$router.push("/center/myOrder");
          } else {
            // 正常流程支付失败
            this.$api
              .pay({
                cartIds: param.cartIds,
                addressId: param.addressId,
                payForm: this.payForm,
                payStatus: 0,
              })
              .then((res) => {
                if (res.status === 100) {
                  this.$message({
                    type: "info",
                    message: res.message,
                  });
                  setTimeout(() => {
                    location.reload();
                  }, 2000);
                } else {
                  this.$message({
                    type: "error",
                    message: res.message,
                  });
                }
              });
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.pay-main {
  margin-bottom: 20px;

  .pay-container {
    margin: 0 auto;
    width: 1200px;

    a:hover {
      color: #4cb9fc;
    }

    .orange {
      color: #e1251b;
    }

    .money {
      font-size: 18px;
    }

    .zfb {
      color: #e1251b;
      font-weight: 700;
    }

    .checkout-tit {
      padding: 10px;

      .tit-txt {
        font-size: 14px;
        line-height: 21px;

        .success-icon {
          width: 30px;
          height: 30px;
          display: inline-block;
          background: url(./images/icon.png) no-repeat 0 0;
        }

        .success-info {
          padding: 0 8px;
          line-height: 30px;
          vertical-align: top;
        }
      }

      .paymark {
        overflow: hidden;
        line-height: 26px;
        text-indent: 38px;

        .fl {
          float: left;
        }

        .fr {
          float: right;

          .lead {
            margin-bottom: 18px;
            font-size: 15px;
            font-weight: 400;
            line-height: 22.5px;
          }
        }
      }
    }

    .checkout-info {
      padding-left: 25px;
      padding-bottom: 15px;
      margin-bottom: 10px;
      border: 2px solid #e1251b;

      h4 {
        margin: 9px 0;
        font-size: 14px;
        line-height: 21px;
        color: #e1251b;
      }

      ol {
        padding-left: 25px;
        list-style-type: decimal;
        line-height: 24px;
        font-size: 14px;
      }

      ul {
        padding-left: 25px;
        list-style-type: disc;
        line-height: 24px;
        font-size: 14px;
      }
    }

    .checkout-steps {
      border: 1px solid #ddd;
      padding: 25px;

      .hr {
        height: 1px;
        background-color: #ddd;
      }

      .step-tit {
        line-height: 36px;
        margin: 15px 0;
      }

      .step-cont {
        margin: 0 10px 12px 20px;
        & > *:last-child {
          margin-left: 20px;
        }
        ul {
          font-size: 0;

          li {
            margin: 2px;
            display: inline-block;
            padding: 5px 5px;
            border: 1px solid #ddd;
            cursor: pointer;
          }
        }
      }
    }

    .submit {
      text-align: center;

      .btn {
        display: inline-block;
        padding: 15px 45px;
        margin: 15px 0 10px;
        font: 18px "微软雅黑";
        font-weight: 700;
        border-radius: 0;
        background-color: #e1251b;
        border: 1px solid #e1251b;
        color: #fff;
        text-align: center;
        vertical-align: middle;
        cursor: pointer;
        user-select: none;
        text-decoration: none;
      }
    }
  }
}
.active {
  border-color: #66afe9;
  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
    0 0 8px rgba(102, 175, 233, 0.6);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
    0 0 8px rgba(102, 175, 233, 0.6) !important;
}
.topBox {
  font-size: 12px;
  .title {
    margin-bottom: 10px;
  }
  .infoBox {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
}
.payBox {
  height: 400px;
  border: 3px solid rgb(166, 166, 166);
  box-sizing: border-box;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  .img {
    width: 290px;
    height: 290px;
    margin: auto 0;
  }
  .line {
    width: 1px;
    height: 290px;
    background-color: rgb(230, 230, 230);
  }
  .right {
    width: 290px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    .rightFlex {
      display: flex;
      justify-content: space-between;
      padding-bottom: 5px;
    }
    .rightOne {
      margin: 15px 0;
      border-bottom: 2px solid rgb(204, 204, 204);
    }
    .rightTow {
      margin: 15px 0;
      font-size: 12px;
    }
    .rightThree {
      margin: 15px 0;
      font-size: 12px;
      .tips {
        margin: 5px 0;
        font-size: 10px;
        color: rgb(168, 168, 168);
      }
    }
  }
}
</style>
