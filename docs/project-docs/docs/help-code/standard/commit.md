## CommitLint

在一个团队中，每个人的 git 的 commit 信息都不一样，五花八门，没有一个机制很难保证规范化，如何才能规范化呢？可能你想到的是 git 的 hook 机制，去写 shell 脚本去实现。这当然可以，其实 JavaScript 有一个很好的工具可以实现这个模板，它就是 commitlint（用于校验 git 提交信息规范）。

### Git 提交规范

参考 [Angular](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular)

-   `feat` 增加新功能
-   `fix` 修复问题/BUG
-   `style` 代码风格相关无影响运行结果的
-   `perf` 优化/性能提升
-   `refactor` 重构
-   `revert` 撤销修改
-   `test` 测试相关
-   `docs` 文档/注释
-   `chore` 依赖更新/脚手架配置修改等
-   `workflow` 工作流改进
-   `ci` 持续集成
-   `types` 类型修改

### 关闭 Git 提交规范检查

如果你想关闭 Git 提交规范检查，有两种方式：

::: code-group

```bash [临时关闭]
git commit -m 'feat: add home page' --no-verify
```

```bash [永久关闭]
# 在 .husky/commit-msg 内注释以下代码即可
pnpm exec commitlint --edit "$1" # [!code --]
```

:::
