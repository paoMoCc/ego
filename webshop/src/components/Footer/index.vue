<template>
  <div class="footer-container">
    <div class="copyright">
      <ul class="helpLink">
        <li>
          关于我们
          <span class="space"></span>
        </li>
        <li>
          联系我们
          <span class="space"></span>
        </li>
        <li>
          关于我们
          <span class="space"></span>
        </li>
        <li>
          商家入驻
          <span class="space"></span>
        </li>
        <li>
          营销中心
          <span class="space"></span>
        </li>
        <li>
          友情链接
          <span class="space"></span>
        </li>
        <li>
          关于我们
          <span class="space"></span>
        </li>
        <li>
          营销中心
          <span class="space"></span>
        </li>
        <li>
          友情链接
          <span class="space"></span>
        </li>
        <li>关于我们</li>
      </ul>
      <p>地址：成都师范学院</p>
      <p>2273670701@qq.com</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Footer",
};
</script>

<style scoped lang="scss">
  .footer-container {
    background-color: #eaeaea;
    width: 100%;
    position: relative;
    bottom: 0;
    margin: 0 auto;

    .copyright {
      padding: 10px;

      .helpLink {
        text-align: center;

        li {
          display: inline;

          .space {
            border-left: 1px solid #666;
            width: 1px;
            height: 13px;
            background: #666;
            margin: 8px 10px;
          }
        }
      }

      p {
        margin: 15px 0;
        text-align: center;
      }
    }
  }
</style>
