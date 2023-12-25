<template>
  <view class="content">
    <custom-header :is-tab="false"></custom-header>
    <view class="text-area" @click="on_open_popup">
      <text class="title">{{ globalData.systemInfo.appVersion }}</text>
    </view>
    <image src="/static/tabbar/tab1-icon-on.png"></image>
    <qm-popup ref="popupRef" popupClass="popup">底部弹出 Popup</qm-popup>

  </view>
</template>

<script setup >
import { onMounted, ref } from 'vue';
import CustomHeader from '@/components/qm-custom-header/index.vue';
import qmPopup from '@/components/qm-popup';
import { useGlobalData } from '@/store/global-data';
import { api_index } from '@/api/index';

const globalData = useGlobalData();
const popupRef = ref(null);
const on_open_popup = () => {
    console.log('111', popupRef.value);
    popupRef.value.open();
};
onMounted(async () => {
    // const res = await api_index({ pageSize: 1, pageNo: 10, noToast: true })
    // console.log(111, res);
});

</script>

<style lang="scss">
.text-area {
  color: $primary-color;
  background: url('~@/static/tabbar/tab1-icon.png');
}

.qm-popup {
  .popup {
    border-radius: 20px 20px 0 0;
  }
}
</style>
