<template>
  <a-dropdown :trigger="trigger" v-bind="$attrs">
    <span>
      <slot></slot>
    </span>
    <template #overlay>
      <a-menu :selectedKeys="selectedKeys">
        <template v-for="item in dropMenuList" :key="`${item.event}`">
          <a-menu-item
            v-bind="getAttr(item.event)"
            @click="handle_click_menu(item)"
            :disabled="item.disabled"
          >
            <a-popconfirm
              v-if="popconfirm && item.popConfirm"
              v-bind="getPopConfirmAttrs(item.popConfirm)"
            >
              <template #icon v-if="item.popConfirm.icon">
                <q-icon :type="item.popConfirm.icon" />
              </template>
              <div>
                <q-icon :type="item.icon as 'default'" v-if="item.icon" />
                <span class="ml-1">{{ item.text }}</span>
              </div>
            </a-popconfirm>
            <template v-else>
              <q-icon :type="item.icon as 'default'" v-if="item.icon" />
              <span class="ml-1">{{ item.text }}</span>
            </template>
          </a-menu-item>
          <a-menu-divider v-if="item.divider" :key="`d-${item.event}`" />
        </template>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { DropMenu } from './types';
import { Dropdown as ADropdown, Menu as AMenu, MenuItem as AMenuItem, Popconfirm as APopconfirm, MenuDivider as AMenuDivider } from 'ant-design-vue';
import {Icon as QIcon} from '@vue3-antd/q-icon/src/icon';
import { omit } from 'lodash-es';
import { isFunction } from '@quantum-design/utils';
import { dropdownProps } from './types';

defineOptions({
    name: 'QAntdDropdown'
});

const props = defineProps(dropdownProps);

const emit = defineEmits(['menuEvent']);

function handle_click_menu(item: DropMenu) {
    const { event } = item;
    const menu = props.dropMenuList.find((item) => `${item.event}` === `${event}`);
    emit('menuEvent', menu);
    item.onClick?.();
}

const getPopConfirmAttrs = computed(() => {
    return (attrs: any) => {
        const originAttrs = omit(attrs, ['confirm', 'cancel', 'icon']);
        if (!attrs.onConfirm && attrs.confirm && isFunction(attrs.confirm))
            originAttrs['onConfirm'] = attrs.confirm;
        if (!attrs.onCancel && attrs.cancel && isFunction(attrs.cancel))
            originAttrs['onCancel'] = attrs.cancel;
        return originAttrs;
    };
});

const getAttr = (key: string | number) => ({ key });
</script>
