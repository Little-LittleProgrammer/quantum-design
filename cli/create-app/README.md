# create-app
sample create-app-cli

## 目录结构
1. command: 处理 命令
2. compile: 编译逻辑，生成最后的文件夹
3. enums: 枚举值
4. questions: 问题模块
5. type: 类型
6. utils: 工具类
7. index: 触发逻辑

## Feature
### question
1. 判断是否要更新
2. 如果输入的命令不带参数
    1. input you projectName
    2. choose your packageManage // pnpm yarn npm
    3. choose your infrastructure mode // monorepo polyrepo
    5. choose your framework // vue2 vue3 nuxt2 nuxt3
    6. choose your template
    7. input your git registry // 
    8. input your npmMirror token // 
3. 如果输入的命令带参数
    1. input your git registry // 
    2. input your npmMirror token // 
    3. 判断模版是否存在，不存在跳出
###  compile
1. 判断infrastructure mode：
    1. monorepo: [monorepo](#monorepo)
    2. polyrepo: [polyrepo](#polyrepo)

#### monorepo
1. 

#### polyrepo