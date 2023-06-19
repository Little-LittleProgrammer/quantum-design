# 权限
> 我们主要采用的是后端控制权限的方式

## 页面权限
页面权限和之前的逻辑一样, 没有改变

## 按钮权限
**按钮code值, 在菜单页面配置**

**按钮权限总共有三种方式控制**

1. hooks方式
```vue
<template>
    <a-button v-if="hasPermission('btn1')">按钮</a-button>
</template>

<script lang='ts' setup>
const {hasPermission} = usePermission();
</script>

```

2. 指令方式

```vue
<template>
    <a-button v-permisson="'btn1'">按钮</a-button>
</template>

<script lang='ts' setup>
</script>

```

3. 组件方式

```vue
<template>
    <qm-authority value="btn1">
        <a-button>按钮</a-button>
    </qm-authority>
</template>

<script lang='ts' setup>
import QmAuthority from '@components/qm-authority'
 </script>

```