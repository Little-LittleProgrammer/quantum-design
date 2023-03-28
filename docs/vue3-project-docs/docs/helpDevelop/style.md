# 开发风格

> template 按照老方式开发即可

## Composition API 式

1.  通过导入 APi 函数来写逻辑, 把  `<script setup></script>` 当做一个代码块作用域, 里面可以任意组合写逻辑

```vue
<script lang="ts" setup>
import { useGo } from '@wuefront/hooks/vue';
import { ref, onMounted } from 'vue'

// 响应式状态
const count = ref(0)
function increment() {
  count.value++
}

// 路由跳转
const go = useGo();
function back_home() {
    go({
        path: '/'
    });
};

// 生命周期钩子
onMounted(() => {
  console.log(`initial`)
})

</script>
```

## hooks 式

1. 将相同逻辑代码放在一起

```vue
<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue'

const {options, change_options} = usePage()
const {data, init_data} = useData();

// 数据部分, 专门负责数据
function useData() {
    const data = reactive({
        a: 1,
        b: 2
    });

    function init_data() {
        change_options(data.a, data.b)
    }
    return {
        data,
        init_data
    }
}

// 分页部分, 专门负责分页
function usePage() {
    type IPageOption = Record<'page' | 'size', number>
    const options = reactive<IPageOption>({
        page: 1,
        size: 2
    });
    function change_options(page:number, size:number) {
        options.page = page
        options.size = size
    }
    return {
        options,
        change_options
    }
}
</script>
```