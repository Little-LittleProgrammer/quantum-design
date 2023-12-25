# q-button
> 按钮用于开始一个即时操作。
---

## 何时使用
标记了一个（或封装一组）操作命令，响应用户点击行为，触发相应的业务逻辑。

<Common-codeView title="代码演示" description="基本按钮用法">
  <v010-tool-demo-button></v010-tool-demo-button>
  <highlight-code slot="codeText" lang="vue">
    <template>
      <div class="demo-button">
        <div>
          <q-button>默认按钮</q-button>
          <q-button type="primary">主要按钮</q-button>
          <q-button type="success">成功按钮</q-button>
          <q-button type="info">信息按钮</q-button>
          <q-button type="warning">警告按钮</q-button>
          <q-button type="danger">危险按钮</q-button>
        </div>
      </div>
    </template>
  </highlight-code>
</Common-codeView>


## API
| 参数           | 说明           | 默认值  | 可选值  | 类型  |
| ------------- |:-------------: | -----| -----|-----|  
| size          | 尺寸 | - | medium / small / mini | string  |
| type          | 类型 | - | primary / success / warning / danger / info / text |string  |
| plain       | 是否朴素按钮    |   false  | true， false | boolean  |
| round       | 是否圆角按钮    |   false  | true， false | boolean  |
| disabled    | 是否禁用状态    |   false  | true， false | boolean  |
| icon        | 图标类名   |   -  | - | string  |
| autofocus       | 是否默认聚焦    |   false  | true， false | boolean  |
| native-type       | 原生 type 属性    |   button  | button / submit / reset | string  |

## 事件
| 事件名称         | 说明           | 回调参数         | 版本  |
| -------------  |:-------------: | ---------------| -----|
| click          | 点击按钮时的回调 | `(event) => void` |      |
