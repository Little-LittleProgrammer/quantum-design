# message

对 `ant-design-vue` 方法类 的 `message` 和 `modal` 进行二次封装

默认居中展示

## 使用方式

### message 
```js
...
import { useMessage } from '@/hooks';
...
const {createMessage} = useMessage();
message.open(config)
message.success(config)
message.error(config)
message.info(config)
message.warning(config)
message.warn(config) // alias of warning
message.loading(config)
...
```

### modal

 - confirm 框

```js
...
import { useMessage } from '@/hooks';
...
const { createConfirm } = useMessage();
const config = {
    iconType = 'info' // "warning" | "success" | "error" | "info"
    // 其余的与 antd 文档一致, 简化了 图标 显示
}

createConfirm(config);
...
```

 - success, error, info, warning 框

```js
...
import { useMessage } from '@/hooks';
...
const { createConfirm } = useMessage();

createSuccessModal(config);
createErrorModal(config)
createInfoModal(config)
createWarningModal(config)
...
```
