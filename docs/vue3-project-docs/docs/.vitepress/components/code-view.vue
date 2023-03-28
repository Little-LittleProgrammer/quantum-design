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
        <div v-show="data.isShow" ref="jsCodeSegment" class="code-segment">
            <slot name="codeText"></slot>
        </div>
        <div v-if="$slots.codeText" class="code-button" >
            <span :title="data.codeTextBtn">
                <q-icon class="show-button" :type="data.isShow?'CaretUpOutlined':'CaretDownOutlined'" @click="handle_toggle_show">1</q-icon>
            </span>
            <span :title="data.copyText">
                <q-icon class="copy-icon" :type="data.copyText=='复制成功'? 'CheckOutlined':'CopyOutlined'" @click="copy_code" @mouseleave="reset_text"> 2</q-icon>
            </span>
      </div>
    </div>
  </template>

<script lang='ts' setup>
import { reactive,onMounted, ref} from 'vue';
import {QIcon} from '@wuefront/vue3-antd-ui'
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
const jsCodeSegment = ref<HTMLElement | null> ( null)

function handle_toggle_show() {
    data.isShow = !data.isShow
    data.codeTextBtn = data.isShow ? '隐藏代码' : '显示代码'
}
function copy_code() {
    const _code = jsCodeSegment.value!.innerText;
    let $input = document.createElement("textarea");
    document.body.appendChild($input);
    $input.value = _code; // 修改文本框的内容
    $input.select(); // 选中文本
    if (document.execCommand("copy")) {
        document.execCommand("copy");
        data.copyText = '复制成功'
    } else {
        data.copyText = '复制失败'
    }
    document.body.removeChild($input);
}
function reset_text() {
    data.copyText = '复制代码'
}
onMounted(() => {
})

</script>
<style lang='scss' scoped>
.code {
  .code-demo {
    border: 1px solid var(--vp-c-divider-light);
    border-bottom: none;
    border-radius: 3px;
    box-shadow: 0 0 2px 0 var(--vp-badge-info-bg),
      0 1px 2px 0 var(--vp-badge-info-bg);
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
      border-top: 1px solid var(--vp-c-divider-light);
      .describe-title {
        background-color: var(--vp-c-bg);
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
  .code-segment{ 
        border-left: 1px solid var(--vp-c-divider-light);
        border-right: 1px solid var(--vp-c-divider-light);
    }
  .code-button {
    background: var(--vp-badge-info-bg);
    color: var(--vp-c-brand);
    font-weight: 400;
    line-height: 40px;
    text-align: center;
    box-shadow: 0 0 8px 0 var(--vp-badge-info-bg),
      0 2px 4px 0 var(--vp-badge-info-bg);
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