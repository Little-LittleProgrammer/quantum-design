# 发布

::: warning 注意
- 项目引用了 `changesets` 管理版本
- 更改版本和发布需严格按照此流程发布, 否则可能会造成版本损坏
- 最好由一个人统一管理和发布
:::

## 简介

- `changesets` 是一个在 `Monorepo` 项目下进行版本管理和发布和 `Changelog` 文件管理的工具。`changesets` 会根据当前分支基于主分支的变化，筛选出需要变更的包，然后开发者可以根据实际场景更新包版本（遵循 semver 规范），填写 `Changelog 信息`，最后发布变更的包。
目前 `pnpm、nx、turborepo` 也推荐使用 `changesets` 来管理版本号和 `Changelog`，有很多开源项目也都在使用 `Changesets`，比如 `pnpm、midwayjs-hooks` 等等。

-  semver 规范: 分为, `major(主要版本)`, `minor(次要版本)`, `patch(小版本)`, 分别对应 `package.json`的 `version` 中的版本号

## 规范
1. 我们完成一次版本迭代，可能会包含多个功能和多个 PR，可能有多个开发者参与开发。
2. 先基于主分支切一个 release 分支作为开发分支。
3. 然后每个开发者基于 release 分支切一个新分支完成他的功能
4. Code Review 通过以后，先合并到 release 分支。
5. 整体测试完成以后，release 分支再合并到主分支，永远保证主分支的代码是足够稳定的。
6. `major`: 主要为大更新, 一般伴随着 `vue` 等主要依赖更新, 或者需要重新设计进行重写
7. `minor`: 主要为次要更新, 功能或者组件的新增, 以及组件破坏性的更新
8. `patch`: 主要为小版本的更新, 缺陷修复, 不影响主要功能的修复


## 发布流程
1. 新建一个release分支, 作为本迭代要发版的分支
2. 新建 feature分支, 合一下release分支, 当我们开发完并初步自测完成后, 进入codeReview环节, 通过后合到release分支,进入release分支
3. 执行 `pnpm changeset add`, 
4. 根据提示选择要发布的包, **这里最好一次只选择一个**, **相互影响的包changeset会自动处理**
5. 根据提示选择需要发布的版本号 `major(主要版本)`, `minor(次要版本)`, `patch(小版本)` 
6. 根据提示输入本次总结性话语, 确定后如果要补充信息, 进入`.changeset`中找到对应的 md 文件进行补充
7. 执行 `pnpm changeset pre enter <tag>`, 命令进入进入 pre 模式
```
pnpm changeset pre enter alpha   # 发布 alpha 版本
pnpm changeset pre enter beta    # 发布 beta 版本
pnpm changeset pre enter rc      # 发布 rc 版本
```
8. 执行 `pnpm changeset version` 更改版本号
9. 执行 `pnpm run build --filter 你要发布的包`, 打包, 如果多个项目, 请多次执行
10. 执行 `pnpm changeset publish` 发布 测试版本 
11. 项目内测试完成后, 发布正式版本, 执行 `pnpm changeset pre exit` 退出 pre 模式
12. 执行 `pnpm changeset version` 更改版本为正式版本号
13. 更新 docs项目, 版本信息, 以及 文档信息
14. 执行 `pnpm run build --filter 你要发布的包` 打包
15. 执行 `pnpm changeset publish` 发布正式版本, 迭代结束

## 修复流程
1. 建立 hotfix 分支
2. 按照 发布流程 3 - 13 执行

## TODO
后续会接入 CI 进行自动化版本修改和发布
