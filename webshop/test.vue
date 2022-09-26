<template>
  <div class="myorder">
    <el-table :data="tableData" stripe row-key="id">
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column label="商品信息" width="300" class="box">
        <template slot-scope="scope">
          <div class="mesSty">
            <img
              class="imgSty"
              src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1607508642445&di=0e36873f5842d9a862bf9f8f2da19510&imgtype=0&src=http%3A%2F%2Fc.hiphotos.baidu.com%2Fzhidao%2Fpic%2Fitem%2Ff3d3572c11dfa9ecc052be8060d0f703918fc12d.jpg"
              alt=""
            />
            <div class="mesFont">
              <p class="pb_sty">
                <span>{{ scope.row.name }}</span>
              </p>
              <p>
                荷兰艾优APIYOO电动牙阿啊阿啊荷兰艾优APIYOO电动牙阿啊阿啊荷兰艾优APIYOO电动牙阿啊阿啊
                啊
              </p>
              <p>蓝色：10*5cm</p>
            </div>
          </div>
          <!-- 提示 -->
          <div class="item">
            <span style="margin-left: 1%"
              >订单编号：678346587485
              <span>共<span style="color: #409eff">10</span>件</span></span
            >
            <span class="hint_pr">下单人信息：小丸子 12786934367</span>
            <span class="hint_pr">下单时间：2020-03-03 20:23:23</span>
            <span class="hint_pr" style="color: #ff2424">售后中</span>
            <el-popover
              placement="top"
              class="hint_pr"
              width="220"
              trigger="hover"
              content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
            >
              <span slot="reference" style="color: #f23645"
                >买家备注 <i class="el-icon-tickets"></i
              ></span>
            </el-popover>

            <el-popover
              placement="top"
              class="hint_pr"
              width="200"
              trigger="hover"
            >
              <div v-if="popSty" class="popH">
                <el-input
                  type="textarea"
                  :rows="2"
                  placeholder="请输入内容"
                  v-model="textarea"
                >
                </el-input>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="popClear"
                    >取消</el-button
                  >
                  <el-button type="primary" size="mini" @click="popEnd"
                    >确定</el-button
                  >
                </div>
              </div>
              <div v-else>
                <p>dasjkdhkjdaks</p>
                <i class="el-icon-edit-outline iconSty" @click="iconBj"></i>
              </div>
              <span slot="reference" style="color: #eba011"
                >卖家备注 <i class="el-icon-tickets"></i
              ></span>
            </el-popover>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        align="right"
        min-width="100"
        label="销售价"
      >
      </el-table-column>
      <el-table-column
        prop="address"
        min-width="140"
        align="center"
        label="数量"
      >
      </el-table-column>
      <el-table-column
        prop="address"
        min-width="140"
        align="center"
        label="订单状态"
      >
      </el-table-column>
      <el-table-column min-width="140" align="center" label="支付方式">
        <template slot-scope="">
          <span>微信</span><span>(100积分)</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        min-width="140"
        align="center"
        label="结算状态"
      >
      </el-table-column>
      <el-table-column
        prop="address"
        min-width="140"
        align="center"
        label="账单状态"
      >
      </el-table-column>
      <el-table-column
        prop="address"
        min-width="140"
        align="center"
        label="开票状态"
      >
      </el-table-column>
      <el-table-column min-width="140" align="right" label="订单总金额">
        <template slot-scope="scope">
          <span style="color: #ff2424"> {{ scope.row.address }}元 </span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="100">
        <template slot-scope="">
          <el-button type="text" size="small">订单详情</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      popSty: false,
      textarea: "",
      tableData: [
        {
          id: 1,
          date: "2016-05-02",
          name: "王小虎",

          address: "12",
        },
        {
          id: 3,
          date: "2016-05-01",
          name: "王小虎",
          address: "12",
        },
        {
          id: 4,
          date: "2016-05-03",
          name: "王小虎",
          address: "12",
        },
      ],
    };
  },
  methods: {
    iconBj() {
      this.popSty = true;
    },
    popClear() {
      this.popSty = false;
      this.textarea = "";
    },
    popEnd() {
      this.popSty = false;
    },
  },
};
</script>

<style scoped>
.el-table--enable-row-transition >>> .el-table__body td {
  padding-top: 2%;
}
/deep/ .el-table tr {
  position: relative;
  width: 100%;
}
/deep/ .cell {
  padding-top: 3%;
}
.item {
  width: 115.5em;
  background: #eee;
  padding: 1% 0;
  position: absolute;
  top: 0;
  left: -55px;
  z-index: 1;
}
</style>

<style lang="scss" scoped>
.myorder {
  margin-left: 160px;
}
.hint_pr {
  padding-left: 10vh;
}
.imgSty {
  width: 80px;
  display: block;
}
.mesSty {
  display: flex;
  align-items: center;
}

.pb_sty span {
  background: #1dc8de;
  padding: 2px 8px;
  border-radius: 4px;
  color: #fff;
}

.mesFont p {
  margin-block-start: 0;
  margin-block-end: 0;
}
.mesFont p:nth-child(2) {
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
.iconSty {
  float: right;
  cursor: pointer;
}
</style>