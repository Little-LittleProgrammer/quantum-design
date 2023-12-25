<template>
  <div class="code">
    <div class="code-title">
      <h2>{{title}}</h2>
      <small>{{description}}</small>
    </div>
    <div class="code-demo">
      <div class="code-content">
        <slot></slot>
      </div>
      <div class="code-describe" v-if="!!describeTitle">
        <div class="describe-title">
          <h4>{{describeTitle}}</h4>
        </div>
        <div class="describe">
          {{describe}}
        </div>
      </div>
    </div>
    <div v-if="isShow" class="code-segment">
      <slot name="codeText"></slot>
    </div>
    <div v-if="$slots.codeText" class="code-button" @click="handleToggleShow">{{codeTextBtn}}</div>
  </div>
</template>

<script>
export default {
  name: 'DemoPage',
  props: ['title', 'description', 'describeTitle', 'describe'],
  data() {
    return {
      isShow: false,
      codeTextBtn: '显示代码'
    }
  },
  mounted() {
  },
  methods: {
    handleToggleShow() {
      this.isShow = !this.isShow
      this.codeTextBtn = this.isShow ? '隐藏代码' : '显示代码'
    }
  }
}
</script>

<style lang="scss" scoped>
.code {
  .code-title {
    h2 {
      padding: 0;
      margin: 0;
      border-bottom: none;
      font-size: 18px;
    }

    small {
      font-size: 14px;
      display: inline-block;
      margin: 10px 0;
      color: #5e6d82;
    }
  }
  .code-demo {
    border: 1px solid #ebebeb;
    border-bottom: none;
    border-radius: 3px;
    box-shadow: 0 0 2px 0 rgba(232, 237, 250, 0.6),
      0 1px 2px 0 rgba(232, 237, 250, 0.5);
      overflow: hidden;
    .code-content {
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      padding: 4%;
      border-bottom: 1px solid #ddd;
    }
    .code-describe {
      margin: 20px 0;
      position: relative;
      border-top: 1px solid #ebebeb;
      border-bottom: 1px solid #ebebeb;
      .describe-title {
        background-color: #fff;
        padding: 0px 6px;
        position: absolute;
        left: 20px;
        top: -22%;
      }
      .describe{
        padding: 18px 24px 12px;
        font-size: 12px;
      }
    }
  }
  .code-button {
    background: #fafbfc;
    color: #409eff;
    font-weight: 400;
    line-height: 40px;
    text-align: center;
    cursor: pointer;
    box-shadow: 0 0 8px 0 rgba(232, 237, 250, 0.6),
      0 2px 4px 0 rgba(232, 237, 250, 0.5);
    &:hover {
      font-size: 17px;
    }
  }

  & + .code {
    margin-top: 40px;
  }

  &:not(:first-child) {
    margin-top: 40px;
  }
}
</style>

