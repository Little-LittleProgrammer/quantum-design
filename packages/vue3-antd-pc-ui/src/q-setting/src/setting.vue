<template>
    <div class="q-project-setting" @click="openDrawer(true)">
      <q-icon class="q-project-setting-icon" type="SettingOutlined"/>
      <setting-drawer :defaultSetting="props.defaultSetting" @register="register" />
    </div>
  </template>
<script lang="ts" setup>
import settingDrawer from './components/setting-drawer.vue';
import {Icon as QIcon} from '@vue3-antd/q-icon/src/icon';
import { useDrawer } from '@vue3-antd/q-drawer';
import { type PropType } from 'vue';
import { type IProjectConfig } from './type';
import './style/setting.scss';

defineOptions({
    name: 'QAntdSetting'
});
const props = defineProps({
    defaultSetting: {
        type: Object as PropType<IProjectConfig>,
        default: () => {}
    }
});

const [register, { openDrawer }] = useDrawer();

</script>
