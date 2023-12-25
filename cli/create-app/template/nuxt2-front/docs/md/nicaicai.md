## q-header-menu

网站header区域的导航栏 ([项目中的应用](/login))

## 代码演示
[demo:vue](../examples/nicaicai.vue)

### Attributes
| 参数          | 说明            | 类型            | 可选值                 | 默认值   |
|-------------  |---------------- |---------------- |---------------------- |-------- |
| list      | 导航数组  | array  |        -            |    []     |
| trigget      | 触发展开方式 | string  |  click / hover  |  click |
| props      | 配置选项，具体看下表 | object  |  -  |  - |
| unfold      | 展开符样式 | number  |  1(箭头) / 2（省略号） |  1 |
| height      | 导航栏高度 | number  |  - |  48 |
| parentPDBottom      | 导航栏展开时容器底部padding | number  |  - |  20 |

### props
| 参数       | 说明                | 类型     | 可选值  | 默认值  |
| -------- | ----------------- | ------ | ---- | ---- |
| label    | 指定导航栏中展示文字对应的属性 | string | —    | label   |
| value    | 指定导航数组的key值 | string | —    | value    |
| href    | a标签的href值 | string | —    | href    |

### Events
| 事件名称           | 说明             | 回调参数                                     |
| -------------- | -------------- | ---------------------------------------- |
| change_tab     | 导航节点被点击时的回调      | 共三个参数(oldKey, item, event)，依次为：上一个导航栏的key值、当前导航节点的元数据data、点击事件event。 |

### Scoped Slot
| name | 说明 |
|------|--------|
| slotTabDetail | 自定义导航栏tab的内容，参数为 { tabItem } |