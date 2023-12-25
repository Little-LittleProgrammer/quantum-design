<template>
  <div class="wrapper padding-top border-top">
    <div class="main error">
      <div class="qm-no-data">
        <img src="~/assets/image/404.png" alt="" />
        <p>抱歉，页面不存在，您可以<a href="/">返回首页</a></p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
    layout: 'layout',
    // eslint-disable-next-line vue/require-prop-types
    props: ['error'] // you can set a custom layout for the error page
};
</script>
<style lang="scss" scoped>
.error {
  @include flex-center();
}
.qm-no-data {
  text-align: center;
  p {
    font-size: 14px;
    line-height: 20px;
    color: #999;
  }
}
</style>
