<template>
    <header-edit-icon v-if="getIsEdit">
      {{ getTitle }}
    </header-edit-icon>
    <span v-else>{{ getTitle }}</span>
    <Tooltip v-if="getHelpMessage?.length">
        <template #title>
            <template v-for="item in getHelpMessage" :key="item">
                <p>{{ item }}</p>
            </template>
        </template>
        <InfoCircleOutlined></InfoCircleOutlined>
    </Tooltip>
  </template>
<script lang="ts">
import type { PropType } from 'vue';
import type { BasicColumn } from '../../types/table';
import { defineComponent, computed } from 'vue';
// import BasicHelp from '/@/components/Basic/src/BasicHelp.vue';
import headerEditIcon from './header-edit-icon.vue';
import { InfoCircleOutlined } from '@ant-design/icons-vue';
import { Tooltip } from 'ant-design-vue';
import { js_is_string } from '@quantum-design/utils';
export default defineComponent({
    name: 'TableHeaderCell',
    components: {
        headerEditIcon,
        InfoCircleOutlined,
        Tooltip
        // BasicHelp
    },
    props: {
        column: {
            type: Object as PropType<BasicColumn>,
            default: () => ({})
        }
    },
    setup(props) {
        const prefixCls = 'q-table-header-cell';

        const getIsEdit = computed(() => !!props.column?.edit);
        const getTitle = computed(() => props.column?.customTitle || props.column?.title);
        const getHelpMessage = computed(() => {
            if (js_is_string(props.column?.helpMessage)) {
                return [props.column?.helpMessage];
            }
            return props.column?.helpMessage;
        });

        return { prefixCls, getIsEdit, getTitle, getHelpMessage };
    }
});
</script>
  <style lang="scss">
    $prefix-cls: 'q-table-header-cell';

    .#{prefix-cls} {
      &__help {
        margin-left: 8px;
        color: rgb(0 0 0 / 65%) !important;
      }
    }
  </style>

