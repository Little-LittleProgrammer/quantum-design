# multipart-upload

在网络带宽允许的情况下，可针对大文件使用分片上传，以提高上传速度

## 实现原理
使用客户端分片方案：
1. 后端封装 初始化、分片上传、合并段 三个接口供前端调用
2. 前端调用初始化接口获取uploadID
3. 前端对文件切片，然后并发调用切片上传接口
4. 待所有切片上传成功，调用后端合并段接口获取资源url链接
>交互时序图

![img](../../assets/multipart-upload.png)

## 使用方式

:::warning 警告
后端需要提供支持分段上传的接口，接口开发可引用封装的分段上传公共库
:::

```vue
<script lang="ts">
import { useMultipartUpload } from '@/hooks/specific/use-multipart-upload';
/**
 * 分片上传
 * @param sourceFile 源文件
 * @param uploadParams 上传配置参数
 * @param onProgress 进度回调函数，回调参数为进度值，类型为number
 * @returns 返回一个Promise函数，成功返回对象包含url字段，失败返回接口响应数据
 */
useMultipartUpload(
    file,
    {
        partSize: 20 * 1024 * 1024,
        dir: 'custom-dir',
        initApi: api_multipart_init,
        uploadApi: api_multipart_upload,
        mergeApi: api_multipart_merge
    },
    (progress: number) => {
        console.log(progress);
    }
).then(_res => {
    console.log('上传成功', _res.url);
}).catch(_err => {
    console.log('上传失败', _err);
});
</script>
```

## API

`useMultipartUpload(sourceFile, uploadParams, onProgress) => Promise<Record<'url', string>>`

|  参数      |   类型   |   说明   |
|:---------:|----------|---------|
|  sourceFile  |  `File`  | 源文件 |
|  uploadParams  |  `IUploadParams`  | 上传配置参数，具体字段见`uploadParams字段详情` |
|  onProgress  |  `(progress: number) => void`  | 上传总进度回调函数，非必填 |

## uploadParams字段详情
|  参数      |   类型   |   默认值   |   说明   |
|:---------:|----------|---------|---------|
|  partSize  |  `number`  |  20 * 1024 * 1024  |  分片大小，单位为字节，默认10M，范围是1~100MB  |
|  dir  |  `string`  |  -  |  上传目录标识，非必填  |
|  initApi  |  `Promise`  |  -  |  获取上传ID接口  |
|  uploadApi  |  `Promise`  |  -  |  上传分片文件接口  |
|  mergeApi  |  `Promise`  |  -  |  合并分片文件接口  |

## 返回
|  参数      |   说明   |
|:---------:|---------|
|  url   | 上传成功后返回的url链接 |
