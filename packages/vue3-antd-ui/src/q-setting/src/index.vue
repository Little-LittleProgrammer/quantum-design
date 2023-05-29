<template>
    <div class="q-project-setting" @click="openDrawer(true)">
      <q-icon class="q-project-setting-icon" type="SettingOutlined"/>
      <setting-drawer :defaultSetting="props.defaultSetting" @register="register" />
    </div>
  </template>
<script lang="ts" setup>
import settingDrawer from './components/setting-drawer.vue';
import { QIcon } from '@/q-icon';
import { useDrawer } from '@/q-drawer';
import { PropType } from 'vue';
import { IProjectConfig } from './type';
import './style/index.scss';
const props = defineProps({
    defaultSetting: {
        type: Object as PropType<IProjectConfig>,
        default: () => {}
    }
});

const [register, { openDrawer }] = useDrawer();

</script>

