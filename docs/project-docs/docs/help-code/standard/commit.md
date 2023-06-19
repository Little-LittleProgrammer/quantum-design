# git commit规范

## 格式

**`type(scope): message`**

### type
- feat: 新特性
- fix: 修改问题
- refactor: 代码重构
- docs: 文档修改
- style: 代码格式修改, 注意不是 css 修改
- test: 测试用例修改
- chore: 其他修改, 比如构建流程, 依赖管理.
- pref: 性能提升的修改
- build: 对项目构建或者依赖的改动
- ci: CI 的修改
- revert: revert 前一个 commit

### scope
commit 影响的范围, 比如: route, component, utils, build…

### message
本次提交做了什么, 具体的内容

## 案例

feat(utils): 增加了 XXX 方法

## TODO
后续会接入强制性提交校验