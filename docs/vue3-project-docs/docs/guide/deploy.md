# 构建&部署

## 构建

项目开发完成之后，执行以下命令进行构建

```bash
# 如果是 前后端分离项目 xxx 为需要打包项目
pnpm build --filter=xxx

# 如果是 前后端不分离项目, 打包成php的
pnpm build php --filter=xxx
```

构建打包成功之后，会在`apps/xxx`下生成 dist 文件夹，里面就是构建打包好的文件

### 预览

发布之前可以在本地进行预览，有多种方式，这里介绍两种

**不能直接打开构建后的 html 文件**

- 使用项目自定的命令进行预览(推荐)

```bash
# 先打包在进行预览
pnpm preview
# 直接预览本地 dist 文件目录
pnpm preview:dist
```


## 压缩

### 开启 gzip 压缩

开启 gzip

::: tip

只需开启 `VITE_BUILD_COMPRESS='gzip'` 即可在打包的同时生成 .gz 文件

:::


### 开启 brotli 压缩

brotli 是比 gzip 压缩率更高的算法，可以与 gzip 共存不会冲突，需要 nginx 安装指定模块并开启即可。

::: tip

只需开启 `VITE_BUILD_COMPRESS='brotli'` 即可在打包的同时生成 .br 文件

:::

```bash
# 根据自己路径来配置更改
# 例如部署在nginx /next/路径下  VITE_BASE_PATH=/next/
VITE_BASE_PATH=/
```

### 同时开启 gzip 与 brotli

只需开启 `VITE_BUILD_COMPRESS='brotli,gzip'` 即可在打包的同时生成 `.gz` 和 `.br` 文件。

### gzip 与 brotli 在 nginx 内的配置

```bash
http {
  # 开启gzip
  gzip on;
  # 开启gzip_static
  # gzip_static 开启后可能会报错，需要安装相应的模块, 具体安装方式可以自行查询
  # 只有这个开启，vue文件打包的.gz文件才会有效果，否则不需要开启gzip进行打包
  gzip_static on;
  gzip_proxied any;
  gzip_min_length 1k;
  gzip_buffers 4 16k;
  #如果nginx中使用了多层代理 必须设置这个才可以开启gzip。
  gzip_http_version 1.0;
  gzip_comp_level 2;
  gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;
  gzip_vary off;
  gzip_disable "MSIE [1-6]\.";

  # 开启 brotli压缩
  # 需要安装对应的nginx模块,具体安装方式可以自行查询
  # 可以与gzip共存不会冲突
  brotli on;
  brotli_comp_level 6;
  brotli_buffers 16 8k;
  brotli_min_length 20;
  brotli_types text/plain text/css application/json application/x-javascript text/xml application/xml application/xml+rss text/javascript application/javascript image/svg+xml;
}
```

## 部署


### 流水线配置
参考`企业模版: 前端_monorepo项目名_Vue_测试环境配置`

**步骤**
1. 复制`企业模版: 前端_monorepo项目名_Vue_测试环境配置`
2. 构建步骤-自定义构建: 将环境变量, 改为自己目前所开发的项目
3. 构建步骤-构建物上传: 将制品名称以及打包路径里的`projectName`换成自己的项目
4. 主机部署-制品, 选择制品
5. 主机部署-主机组, 选择需要布置的服务器
6. 主机部署-部署脚本, 将部署脚本的解压目录设置为自己项目的目录
7. 配合运维进行以下步骤
8. 点击运行


### 发布(以下一般为服务端或者运维处理)

简单的部署只需要将最终生成的静态文件，dist 文件夹的静态文件发布到你的 cdn 或者静态服务器即可，需要注意的是其中的 index.html 通常会是你后台服务的入口页面，在确定了 js 和 css 的静态之后可能需要改变页面的引入路径。

例如上传到 nginx

`/srv/www/project/index.html`

```bash
# nginx配置
location / {
  # 不缓存html，防止程序更新后缓存继续生效
  if ($request_filename ~* .*\.(?:htm|html)$) {
    add_header Cache-Control "private, no-store, no-cache, must-revalidate, proxy-revalidate";
    access_log on;
  }
  # 这里是vue打包文件dist内的文件的存放路径
  root   /srv/www/project/;
  index  index.html index.htm;
}

```

**部署时可能会发现资源路径不对，只需要修改`.env.production`文件即可。**

```bash
# 根据自己路径来配置更改
# 注意需要以 / 开头和结尾
VITE_BASE_PATH=/
VITE_BASE_PATH=/xxx/
```

### 前端路由与服务端的结合

项目前端路由使用的是 vue-router，所以你可以选择两种方式：history 和 hash。

- **hash** 默认会在 url 后面拼接`#`
- **history** 则不会，不过 `history` 需要服务器配合

可在 [src/router/index.ts](https://github.com/anncwb/vite-project/tree/main/src/router/index.ts) 内进行 mode 修改

```ts
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';

createRouter({
  history: createWebHashHistory(),
  // or
  history: createWebHistory(),
});
```

### history 路由模式下服务端配置

开启 history 模式需要服务器配置，更多的服务器配置详情可以看 [history-mode](https://next.router.vuejs.org/guide/essentials/history-mode.html#html5-mode)

这里以 nginx 配置为例

**部署到根目录**

```bash
server {
  listen 80;
  location / {
    # 用于配合 History 使用
    try_files $uri $uri/ /index.html;
  }
}
```

**部署到非根目录**

1. 首先需要在打包的时候更改配置

```bash
# 在.env.production内，配置子目录路径
VITE_BASE_PATH = /sub/
```

```bash
server {
    listen       80;
    server_name  localhost;
    location /sub/ {
      # 这里是vue打包文件dist内的文件的存放路径
      alias   /srv/www/project/;
      index index.html index.htm;
      try_files $uri $uri/ /sub/index.html;
    }
}
```

### 使用 nginx 处理跨域 (以下一般为服务端或者运维处理)

使用 nginx 处理项目部署后的跨域问题

1. 配置前端项目接口地址

```bash
# 在.env.production内，配置接口地址
VITE_GLOB_API_URL=/api
```

2. 在 nginx 配置请求转发到后台

```bash
server {
  listen       8080;
  server_name  localhost;
  # 接口代理，用于解决跨域问题
  location /api {
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    # 后台接口地址
    proxy_pass http://110.110.1.1:8080/api;
    proxy_redirect default;
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Headers X-Requested-With;
    add_header Access-Control-Allow-Methods GET,POST,OPTIONS;
  }
}
```
