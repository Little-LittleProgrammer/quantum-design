# 介绍

这里是组件文档的开发使用手册

> 本组件库搭载了Ant Design Vue 组件， 所以可以直接在markdown中使用

# 默认组件组册方式
* vuepress会默认将`.vuepress/components`目录下的所有文件注册成全局组件
    * 对应方式如下
    ```
    └─ .vuepress
    └─ components
        ├─ demo-1.vue
        ├─ OtherComponent.vue
        └─ Foo
            └─ Bar.vue
    ```
    ```
    <demo-1/>
    <OtherComponent/>
    <Foo-Bar/>
    ```
* 如果想自定义，可以在`config.js`文件中配置,[配置方式](https://vuepress.vuejs.org/zh/plugin/official/plugin-register-components.html#%E9%80%89%E9%A1%B9)


# 组件布置到组件库文档的方式

1. 将已经开发完毕的组件，根据版本，放到`docs/.vuepress/components/vxxx/src`目录下
2. 根据组件功能，将用例放到对应的目录下
    > 尽量将组件所用的样式拆离到`pubilc/css`下(elementUI就是这么操作的)  
    > 例如：q-loading为布局组件，则放在`docs/.vuepress/components/vxxx/layout`目录下
3. 根据组件功能，在`baseComponents/x.x.x`目录下，建立对应的`markdown`文档
    1. markdown文档的书写格式，标题，API
    2. 使用`Common-codeView`组件将你所写的组件用例包裹住,`highlight-code`为代码书写位置，slot为codeText
    3. `xxx-xxx`为组件用例名称
    ```html
        <Common-codeView title="基本用法" description="基本按钮用法">
            <xxx-xxx></xxx-xxx>
            <highlight-code slot="codeText" lang="vue">
            </highlight-code>
        </Common-codeView>
    ```
4. 将最后的markdown文件的路径，配置到`.vuepress/config.js`中

# 版本更新方式
触发条件：当你所写的组件要进行大浮动的升级
1. 首先在baseComponents建立版本目录
2. 在所建立的版本目录中写入此版本的介绍 README.md文档
3. 按照`组件布置到组件库文档的方式-步骤三`去操作
4. 配置`config.js`文件
    1. 在`themeConfig.nav`版本中配置item
    ```
    {
        text: '版本',
        ariaLabel: 'Language Menu',
        items: [
            // 在此插入新版本
            { text: '0.1.0', link: '/baseComponents/0.1.0/' },
            { text: '0.0.9', link: '/baseComponents/0.0.9/' },
        ]
    },
    ```
    2. 将 `{ text: '组件文档', link: '/baseComponents/0.1.0/' },`的`0.1.0`更新为最新版本
    3. 更新`sidebar`
