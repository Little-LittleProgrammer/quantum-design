# vue types

## defineOptions
 setup语法糖下的 组件命名
### 使用方式
```vue
<!--  -->
<template>
    <div></div>
</template>

<script lang='ts' setup>
defineOptions({
    name: 'xxxx'
})
</script>
<style lang='scss' scoped>
</style>


```
### 使用方式
```js
props: {
    // 定义一个为 boolean 类型,且默认值为 false 的数据
    visible: propTypes.bool.def(false)
    str: propTypes.string.def('vue3')
},

```

## propTypes

对子组件接受父组件 `props` 属性进行了二次封装, 可以更方便的定义基本类型和默认值

### 使用方式
```js
props: {
    // 定义一个为 boolean 类型,且默认值为 false 的数据
    visible: propTypes.bool.def(false)
    str: propTypes.string.def('vue3')
},

```

## IMenuData
服务端权限返回的结构
```ts
export declare interface menuData {
    /**
     * 权限名称
     */
    auth_name?: string;
    /**
      * 子级
      */
    children?: menuData[];
    /**
      * 菜单图标
      */
    icon?: string;
    /**
      * id
      */
    id?: number;
    /**
      * 对应url
      */
    path?: string;
    /**
      * 路径类型，1菜单，2接口
      */
    path_type?: number;
    /**
      * 父级id
      */
    pid?: number;
    /**
      * 排序权重
      */
    sort?: number;
    edit?: number
}

```

##