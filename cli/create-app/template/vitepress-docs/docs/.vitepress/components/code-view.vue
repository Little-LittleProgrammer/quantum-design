<!--  -->
<template>
    <div class="code">
        <div class="code-demo">
            <div class="code-content">
                <slot></slot>
            </div>
            <div class="code-describe" v-if="!!props.title">
                <div class="describe-title">
                    <h4>{{props.title}}</h4>
                </div>
                <div class="describe">
                    {{props.description}}
                </div>
            </div>
        </div>
        <div v-show="data.isShow" ref="js-code-segment" class="code-segment">
            <slot name="codeText"></slot>
        </div>
        <div v-if="$slots.codeText" class="code-button" >
            <span :title="data.codeTextBtn">
                <a class="show-button" :type="data.isShow?'CaretUpOutline':'CaretDownOutline'" @click="handle_toggle_show">1</a>
            </span>
            <span :title="data.copyText">
                <a class="copy-icon" :type="data.copyText=='复制成功'? 'CheckOutLine':'CopyOutline'" @click="copy_code" @mouseleave="reset_text"> 2</a>
            </span>
      </div>
    </div>
  </template>

<script lang='ts' setup>
import { reactive,onMounted} from 'vue';
import {QIcon} from '@q-front-npm/vue3-antd-pc-ui'
const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
})
const data = reactive({
    isShow: false,
    codeTextBtn: '显示代码',
    copyText: '复制代码'
})

function handle_toggle_show() {
    data.isShow = !data.isShow
    data.codeTextBtn = data.isShow ? '隐藏代码' : '显示代码'
}
function copy_code() {
    const _code = this.$refs['js-code-segment'].innerText;
    let $input = document.createElement("textarea");
    document.body.appendChild($input);
    $input.value = _code; // 修改文本框的内容
    $input.select(); // 选中文本
    if (document.execCommand("copy")) {
        document.execCommand("copy");
    this.copyText = '复制成功'
    } else {
        this.copyText = '复制失败'
    }
    document.body.removeChild($input);
}
function reset_text() {
    this.copyText = '复制代码'
}
onMounted(() => {
})

</script>
<style lang='scss' scoped>
.code {
  .code-demo {
    border: 1px solid rgb(235, 237, 240);
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
      padding: 30px;
    }
    .code-describe {
      margin: 10px 0;
      position: relative;
      border-top: 1px solid rgb(235, 237, 240);
      .describe-title {
        background-color: #fff;
        padding: 0px 6px;
        position: absolute;
        left: 20px;
        top: -22%;
      }
      .describe{
        padding: 18px 36px 12px;
        font-size: 12px;
        color: #5e6d82;
      }
    }
  }
  .code-button {
    background: #fafbfc;
    color: #409eff;
    font-weight: 400;
    line-height: 40px;
    text-align: center;
    box-shadow: 0 0 8px 0 rgba(232, 237, 250, 0.6),
      0 2px 4px 0 rgba(232, 237, 250, 0.5);
    .show-button {
      cursor: pointer;
      &:hover {
          font-size: 18px;
          color: #FAA000;
      }
    }
    .hide {
      display: none;
    }
    .copy-icon {
      cursor: pointer;
      margin-left: 20px;
      &:hover {
          font-size: 18px;
          color: #FAA000;
      }
    }
   
  }

  
}
</style>