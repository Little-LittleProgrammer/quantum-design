# dropdown
对 `ant-design-vue`里的 dropdown 功能的二次封装

## 使用

```vue
<template>
    <dropdown :dropMenuList="dropMenuList" :trigger="getTrigger" @menuEvent="handle_menu_event">
        <span class="tabs-drop-down-extra-quick" v-else @click="handle_context">
            <Icon type="DownOutlined" />
        </span>
    </dropdown>
</template>

<script lang="ts" setup>
import Dropdown from '@/components/Dropdown/Dropdown.vue';
const dropMenuList: DropMenu[] = [
    // 格式 1
    {
        icon: 'RedoOutlined',
        text: '刷新',
        disabled: false,
        popConfirm: {
            title: '是否要刷新',
            confirm: reload_page.bind(null, route)
        }
    },
    // 格式 2
    {
        icon: 'RedoOutlined',
        text: '返回',
        disabled: false,
        event: 'prev'
    },
    // 格式 3
    {
        icon: 'RedoOutlined',
        text: '前进',
        disabled: false,
        onClick: next.bind(null, route)
    }
]
const handle_menu_event(menu: DropMenu):void {
    const {event} = menu;
    if (event == 'prev') {
        prev_page()
    }
}
const getTrigger = 'contextmenu'
</script>
```

### API
| 属性   |                 类型                | 默认值 | 可选值 | 说明      |
| ------ | ---------------------------------- | ------ | ---- | ----------- |
| trigger | string |  `contextmenu`  |  `'contextmenu' \| 'click' \| 'hover'`   | 菜单触发条件 |
| dropMenuList | `DropMenu` |  -   |  -   | 下拉菜单, 具体类型看[`DropMenu[]`](#DropMenu[]) |
| selectedKeys | `string ` |  -   |  -   | `menu`选中的菜单 |
| - | `slot ` |  -   |  -   | 向外暴露的slot |

### 事件
| 事件名称   |                 说明                | 回调参数 |
| ------ | ---------------------------------- | ------ | 
| menuEvent | 与 `event`设置的string值对应, 设置`event`对应的函数  |  Function  |


### DropMenu[]
```js
export interface DropMenu {
  onClick?: Fn; // 点击事件
  icon?: string; // 图标
  event: string | number; // 事件名称, 与 @menuEvent对应
  text: string; // 显示文案
  disabled?: boolean; // 是否可以点击
  divider?: boolean; // 分割线 (上)
  popConfirm: Object // 具体属性可以参考 a-design-vue中 的 popconfirm
}
```