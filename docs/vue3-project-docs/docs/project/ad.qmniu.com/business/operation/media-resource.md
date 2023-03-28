# MediaResource

## 介绍
`adUnitManage`: 广告位管理

`creativeTemplate`: 创意模版管理

`mediaManage`: 媒体管理

### 广告位管理
列表：状态列不同状态有颜色区分

编辑页：
* 可选择创意模版，直接利用 modal 渲染创意模版列表。
修改列表的筛选条件够后不清空 checkbox 项，直接暴露给父组件`selectedRecord`。
父组件根据`selectedRecord`中的元素展示模版
* 新建创意模版，直接打开创意页面并且打开编辑页面

### 创意模版管理
列表：
* 状态列不同状态有颜色区分
* `props.showAll`用于区分是在选择创意模版 modal 中调用还是原生的创意模版列表
* `props.format`根据编辑页面选中的广告形式，在打开 modal 时填入创意模版列表的筛选项
```ts
if (!props.showAll && props.format) {
        await setFieldsValue({ format: Number(props.format) });
    }
```
* `route.query.open`为1则加载页面时打开新建页面

编辑页：创意形式为纯图不需要选择创意元素。创意形式本质是`type`为1的创意元素,用`elementOne`数组保存。创意元素用`elementElse`数组保存，提交时将两者进行合并
```ts
const _value: ICreativeTemplateUpdate = getFieldsValue() as ICreativeTemplateUpdate;
        if (_value.creative_type === 1) {
            elementElse.value = [];
        } else {
            const _typeElse = elementElse.value.map(n => n.type);
            if (_typeElse.length !== new Set(_typeElse).size) return message.error('每种创意元素只能选择一次');

            elementElse.value.forEach(n => { // 只有文字把图片相关都设置为0
                if (textArr.includes(n.type)) {
                    n.height = 0;
                    n.width = 0;
                    n.size_type = 0;
                    n.max_img_size = 0;
                }
            });
        }
        _value.elements = [...elementOne.value, ...elementElse.value];
```

### 媒体管理
列表：状态列不同状态有颜色区分。广告位个数列，如果广告位处于启用状态下，可点击数字跳转至广告位管理并自动选中对应的媒体