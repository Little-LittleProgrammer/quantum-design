# qm-ali-cloud
快速 阿里云 cli 工具

## 使用方式
`npx qm-ali-cli -c`: 根据当前分支 快速创建 mr
`npx qm-ali-cli -a`: 根据当前分支 快速运行 appstack

## qm-ali.json

> 使用时请在项目根目录创建 此文件
```json
{
    "token": "xxx", // 阿里云效 token
    "appStackName": "q-front-npm", // appstack 名称
    "apiKey": "xxx", // ali百炼 api key
    "repoName": "q-front-npm", // 仓库名称
    "sourceBranch": "master", // 
    "targetBranch": "master", // 默认合并 1 分支
    "reviewerUsers": ["刘静秋", "余沾沾", "刘如月", "吴忠", "齐琪", "吴安乐", "倪颖峰"],
    "modelName": "deepseek-v3"
}

```
