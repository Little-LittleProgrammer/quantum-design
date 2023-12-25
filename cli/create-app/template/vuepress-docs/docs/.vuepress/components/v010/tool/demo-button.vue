<template>
  <div class="demo-button">
    <div>
      <v010-component-q-button size="mini">默认按钮</v010-component-q-button>
      <v010-component-q-button type="primary" >主要按钮</v010-component-q-button>
      <v010-component-q-button type="success" :autofocus = "true">成功按钮</v010-component-q-button>
      <v010-component-q-button type="info" :loading="true">信息按钮</v010-component-q-button>
      <v010-component-q-button type="warning" :round="true">警告按钮</v010-component-q-button>
      <v010-component-q-button type="danger" disabled>危险按钮</v010-component-q-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'buttonWrap',
}
</script>

<style lang="less" scoped>
.demo-button{
  width: 100%;
  text-align: center;
  div {
    margin: 10px 0;
  }
}
</style>

