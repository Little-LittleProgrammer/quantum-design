<template>
  <view class="qm-popup" v-if="visible" catchMove>
    <qm-mask @click="on_mask_click"></qm-mask>
    <view class="popup-content" :class="[animateClass, props.popupClass]">
      <slot></slot>
    </view>
  </view>
</template>
<script setup>
import qmMask from '../qm-mask';
import { ref } from 'vue';
import { positionAnimateClass } from './const';

const props = defineProps({
    popupClass: {
        type: String,
        default: ''
    },
    position: {
    // 'center' | 'top' | 'right' | 'bottom' | 'left'
        type: String,
        default: 'bottom'
    }
});

const visible = ref(false);
const animateClass = ref('');

const on_mask_click = () => {
    close();
};

const open = () => {
    visible.value = true;
    animateClass.value = `popup-content_${props.position} ${
        positionAnimateClass[props.position][0]
    }`;
};

const close = () => {
    animateClass.value = `popup-content_${props.position} ${
        positionAnimateClass[props.position][1]
    }`;
    setTimeout(() => {
        visible.value = false;
    }, 300);
};

defineExpose({
    open,
    close
});
</script>
<style lang="less">
.qm-popup {
  position: fixed;
  z-index: 99999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;

  .popup-content {
    position: absolute;
    z-index: 2;
    width: 60vw;
    height: 300px;
    background-color: #fff;
    animation-timing-function: linear;
    animation-duration: 0.3s;
    animation-fill-mode: forwards;

    &_center {
      top: 50%;
      left: 50%;
    }

    &_top {
      left: 0;
      right: 0;
      top: 0;
      width: 100%;
    }

    &_bottom {
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
    }

    &_left {
      left: 0;
      top: 0;
      bottom: 0;
      height: 100%;
    }

    &_right {
      right: 0;
      top: 0;
      bottom: 0;
      height: 100%;
    }
  }

  .scale-small-to-big {
    animation-name: scaleSmallToBig;
  }

  .scale-big-to-small {
    animation-name: scaleBigToSmall;
  }

  @keyframes scaleSmallToBig {
    from {
      transform: translate(-50%, -50%) scale(0.8);
    }

    to {
      transform: translate(-50%, -50%) scale(1);
    }
  }

  @keyframes scaleBigToSmall {
    from {
      transform: translate(-50%, -50%) scale(1);
    }

    to {
      transform: translate(-50%, -50%) scale(0.8);
    }
  }
}
</style>
