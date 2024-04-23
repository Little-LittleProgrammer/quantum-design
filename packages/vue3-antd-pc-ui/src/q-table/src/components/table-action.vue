<template>
  <div id="basicTableAction" class="basic-table-action" @click="on_cell_click">
    <template v-for="(action, index) in get_actions" :key="`${index}-${action.label}`">
      <a-tooltip v-if="action.tooltip" v-bind="get_tooltip(action.tooltip)">
        <a-popconfirm v-if="action.popConfirm" v-bind="get_pop_confirm(action.popConfirm)">
          <q-icon :type="action.icon as 'default'" :class="{ 'mr-1': !!action.label }" v-if="action.icon" />
          <a-button v-bind="action" v-if="action.label">{{ action.label }}</a-button>
        </a-popconfirm>
        <a-button v-else v-bind="action">{{ action.label }}</a-button>
      </a-tooltip>
      <template v-else>
        <a-popconfirm v-if="action.popConfirm" v-bind="get_pop_confirm(action.popConfirm)">
          <QIcon :type="action.icon as 'default'" :class="{ 'mr-1': !!action.label }" v-if="action.icon" />
          <a-button v-bind="action" v-if="action.label">{{ action.label }}</a-button>
        </a-popconfirm>
        <a-button v-else v-bind="action">{{ action.label }}</a-button>
      </template>
      <Divider
        type="vertical"
        class="action-divider"
        v-if="divider && index < get_actions.length - 1"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { PropType, computed, toRaw } from 'vue';
import { Divider, TooltipProps, Button as AButton, Tooltip as ATooltip, Popconfirm as APopconfirm } from 'ant-design-vue';
import { Icon as QIcon } from '@vue3-antd/q-icon/src/icon';
import { ActionItem } from '../types/table-action';
import { isBoolean, isFunction, isString } from '@quantum-design/utils';
import { propTypes } from '@quantum-design/types/vue/types';
defineOptions({
    name: 'QAntdTableAction'
});
const props = defineProps({
    actions: {
        type: Array as PropType<ActionItem[]>,
        default: null
    },
    divider: propTypes.bool.def(true),
    outside: propTypes.bool,
    stopButtonPropagation: propTypes.bool.def(false)
});

function is_if_show(action: ActionItem): boolean {
    const _ifShow = action.ifShow;

    let is_if_show = true;

    if (isBoolean(_ifShow)) {
        is_if_show = _ifShow;
    }
    if (isFunction(_ifShow)) {
        is_if_show = _ifShow(action);
    }
    return is_if_show;
}

const get_actions = computed(() => {
    return (toRaw(props.actions) || [])
        .filter((action) => {
            return is_if_show(action);
        })
        .map((action) => {
            return {
                type: 'link',
                size: 'small',
                ...action
            };
        });
});

const get_pop_confirm = (data: any) => {
    return {
        ...(data || {}),
        onConfirm: data?.confirm,
        onCancel: data?.cancel,
        enable: !!data
    };
};

function get_tooltip(data: string | TooltipProps): TooltipProps {
    return {
        placement: 'bottom',
        ...(isString(data) ? { title: data } : data)
    };
}

function on_cell_click(e: MouseEvent) {
    if (!props.stopButtonPropagation) return;
    const path = e.composedPath() as HTMLElement[];

    const isInButton = path.find((ele) => {
        return ele.tagName?.toUpperCase() === 'BUTTON';
    });
    isInButton && e.stopPropagation();
}
</script>
<style lang="scss">
#basicTableAction.basic-table-action {
    display: flex;
    align-items: center;
    justify-content: center;
    .mr-1 {
      margin-left: 1px;
    }
    .ant-btn {
      margin-left: 0px;
    }

    .action-divider {
      display: table;
    }

    button {
      display: flex;
      align-items: center;

      span {
        margin-left: 0 !important;
      }
    }

    button.ant-btn-circle {
      span {
        margin: auto !important;
      }
    }

    .ant-divider,
    .ant-divider-vertical {
      margin: 0 2px;
    }

    .icon-more {
      transform: rotate(90deg);

      svg {
        font-size: 1.1em;
        font-weight: 700;
      }
    }
  }
</style>
