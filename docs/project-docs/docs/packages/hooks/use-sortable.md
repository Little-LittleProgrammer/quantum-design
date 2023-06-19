# 拖拽排序

sortablejs的二次封装hooks

## Usage

```js
import { useSortable } from '@q-front-npm/hooks';
const { initSortable } = useSortable(el, {
    // 过滤, 初始化页面不能移动
    filter: (e) => {
        const text = (e as unknown as ChangeEvent)?.target?.innerText;
        if (!text) return false;
        return affixTextList.includes(text);
    },
    onEnd: (evt) => {
        console.log(evt);

        const { oldIndex, newIndex } = evt;

        if (isNullAndUnDef(oldIndex) || isNullAndUnDef(newIndex) || oldIndex === newIndex) {
            return;
        }

        store.sort_tabs({oldIndex, newIndex});
    }
});
initSortable();
```

## API

### 传参
`el` 当前要操作的元素  
`options`:  typeof sortablejs, 具体参考[sortable](http://www.sortablejs.com/)
```js
useSortable(el, options)
```

### export

initSortable: 初始化拖拽方法
