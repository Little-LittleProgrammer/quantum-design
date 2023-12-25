# vue-mange-tpl

## 项目搭建步骤
```
1.vue-create-app vue-mange-tpl
```

```
2.新建 src/assets, 在assets下新建fonts、images、js、style文件夹用来存放项目的静态文件，js其实就是utils放进来的。
```

```
3.新建 src/component, 里面新建Header、Aside、Content等组件，作为公共组件
```

```
4.新建 src/http, 简单封装下axios，export常用的get、post、patch、put等请求，相应页面的请求写在相应的页面名字的js里.
```

```
5.新建 src/layout，ps: 个人觉的正常的业务逻辑需要用户先登陆，不然就是login，login是不需要header、aside、content的，
所以路由可以设计成除了login类似的，都是作为layout的子路由去处理,类似
    const routes = [
        {
            path: "",
            component: resolve => require(["@/layout"], resolve),
            name: "管理界面",
            meta: {},
            children: [
            {
                path: 'test',
                component: resolve =>
                require(["../views/test/frist"], resolve),
                name: "测试页面1",
                meta: {},
            }
            ]
        },
        {
            path: "/404",
            component: resolve => require(["@/views/404"], resolve),
            name: "404",
            meta: {}
        },
        {
            path: '/login',
            component: resolve => require(["@/views/login"], resolve),
            name: "登陆",
            meta: {}
        }
];
```

```
6.store就简单的模块化就好了，页面使用vuex提供的映射，把需要的全局状态映射到组件内部即可。
```

```
7.views存放页面，没什么说的
```

```
8.app.vue 作为入口，我们可以去做用户的登陆处理、菜单权限获取等等。
```

```
9.新建.env、.env.development、.env.staging、.env.prod等多环境配置文件，满足不同命令打包时使用不同环境的配置.
```


### 项目运行
```
运行项目：yarn dev || npm run dev
运行模拟接口：yarn server || npm run server
运行ui界面： vue ui
```

### 更多vue.config.js的配置
官方文档： [Configuration Reference](https://cli.vuejs.org/config/).
