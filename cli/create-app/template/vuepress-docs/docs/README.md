---
home: true
heroImage: /logo.png
actionText: 前往 →
actionLink: /baseComponents/0.1.0/
actionBtn:
  text: 前往 →
  link: /baseComponents/0.1.0/
  type: primary
  ghost: true
  size: large
features:
- title: 组件库
  details: 基本组件，为开发提供快速，可用的组件
- title: 知识库
  details: 积累前端相关的知识，项目中难题的解决方案记录等等

footer:
  Written by 七猫前端技术团队  © 2021 
footerWrap: 
- headline: 组件库贡献者
  items:
  - title: inno.Pu
    link: https://tech.qimao.com/author/inno/
    details: A handsome boy
  - title: Zachary
    link: https://tech.qimao.com/author/zachary/
    details: A handsome boy
  - title: Evan Wu
    link: https://tech.qimao.com/author/evan/
    details: A handsome boy
  - title: Cindy
    link: https://tech.qimao.com/author/cindy/
    details: A beautiful young lady
- headline:  ·
  items:
  - title: inno.Pu
    link: https://tech.qimao.com/author/inno/
    details: A handsome boy
  - title: Zachary
    link: https://tech.qimao.com/author/zachary/
    details: A handsome boy
  - title: Evan Wu
    link: https://tech.qimao.com/author/evan/
    details: A handsome boy
  - title: cindy
    link: https://tech.qimao.com/author/cindy/
    details: A beautiful young lady
- headline:  ·
  items:
  - title: inno.Pu
    link: https://tech.qimao.com/author/inno/
    details: A handsome boy
  - title: Zachary
    link: https://tech.qimao.com/author/zachary/
    details: A handsome boy
  - title: Evan Wu
    link: https://tech.qimao.com/author/evan/
    details: A handsome boy
  - title: cindy
    link: https://tech.qimao.com/author/cindy/
    details: A beautiful young lady
- headline: 七猫
  items:
  - title: 七猫中文网
    link: https://www.qimao.com/
    details: 你爱看的全都有
  - title: 梧桐中文网
    link: https://www.wtzw.com/
    details: 你爱看的全都有
  - title: 七猫技术团队
    link: https://tech.qimao.com/
    details: 专业IT技术社区
  - title: 七猫招聘
    link: https://www.qimao.com/
    details: 欢迎加入
---

# 快速使用

## 添加公司npm私有源
>安装nrm管理npm（npm install -g nrm）  
>公司搭建私有npm服务器  
>nrm add qmnpm http://8.140.119.108:4873/  
>阿里云效--npm服务器  
>nrm add codeup https://packages.aliyun.com/5f6426fcdb0493ecef9118ab/npm/npm-registry/

## 使用公司npm私有源
>nrm use qmnpm  
>OR  
>nrm use codeup

## 安装公司公共组件包
>yarn add qm-npm-pc  
OR  
>npm install qm-npm-pc

## 如何使用
main.js中引入全局样式
>import 'qimao-pc-component/lib/component.css';

### 全局引用
>import { QmHighlight } from 'qm-npm-pc';  
>Vue.use(QmHighlight);

### 按需引用
在需要用到组件的页面直接引用组件即可
>import { QmHighlight } from 'qm-npm-pc';

## 发布时注意项
+ 公司codeup发布时，需要注意代理问题，正常使用北京的集群是没有问题的
+ 使用香港的集群需要手动**配置代理**
	+ 项目中添加``.npmrc``文件，加入下面内容  
	> home=https://www.npmjs.org  
	> registry=https://packages.aliyun.com/变量1/npm/npm-registry/  
	> //packages.aliyun.com/变量1/npm/npm-registry/:_authToken= 变量2
	+ **变量1**：![](https://tva1.sinaimg.cn/large/008i3skNgy1grbz9un7fdj30zg0ayq4n.jpg)
	+ **变量2**：
		+ 先登录npm![](https://tva1.sinaimg.cn/large/008i3skNgy1grbzbfubx3j30qm0dyab5.jpg)
		+ nrm use codeup 切到codeup源
		+ vim /Users/个人电脑名称/.npmrc![](https://tva1.sinaimg.cn/large/008i3skNgy1grbzdf1tdsj30dr040t95.jpg)找到authToken
+ 提交发布即可使用香港集群发布（参考：http://wiki.km.com/pages/viewpage.action?pageId=20350134）


