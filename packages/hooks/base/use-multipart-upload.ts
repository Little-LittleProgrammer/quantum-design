// 接口返回结果
interface IResult<T = any> {
    code: number;
    data: T;
    msg: string;
}
// 初始化接口传参
interface IInitApiReq {
    name: string; //文件名
    dir: string; //上传目录标识
}
// 分段上传接口传参
interface IUploadApiReq {
    upload_id: string; //分段任务ID
    part_number: number; //段号，取值范围：1~10000
    part_size: number; //源文件中某一分段的大小，单位为字节
    file: Blob; //分片文件流
}
// 合并段接口传参
interface IMergeApiReq {
    upload_id: string; //分段任务ID
}
// 文件分段配置
interface IUploadParams {
    partSize?: number; //分片大小，非必填，默认10M
    dir?: string; //上传目录标识，非必填
    initApi: Fn; //获取uploadId接口
    uploadApi: Fn; //上传分片文件接口
    mergeApi: Fn; //合并分片文件接口
}

/**
 * 分片上传
 * @param sourceFile 源文件
 * @param uploadParams 上传配置参数
 * @param onProgress 进度回调函数，回调参数为进度值，类型为number
 * @returns 返回一个Promise函数，成功返回对象包含url字段，失败返回接口响应数据
 *
 * 调用示例
 * import { useMultipartUpload } from '@/hooks/specific/use-multipart-upload';
 * useMultipartUpload(
        option.file,
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
    ).then(res => {
        createMessage.success('上传成功', res.url);
    });
 */
let _progressTimer: TimeoutHandle; // 进度条计时器
export function useMultipartUpload(sourceFile: File, uploadParams: IUploadParams, onProgress?: (progress: number) => void): Promise<Record<'url', string>> {
    // 切片大小
    const _chunkSize = uploadParams.partSize || 10 * 1024 * 1024;
    // 源文件大小
    const _fileSize = sourceFile.size;
    // 计算总切片数
    const _chunkTotal = Math.ceil(_fileSize / _chunkSize);
    // 记录上传成功切片的数量
    let _successTotal = 0;
    // 切片起始位置
    let _start = 0;
    let _end;
    // 当前切片序号
    let _chunkIndex = 0;
    // 上传id
    let _uploadId = '';
    // 上传总进度
    let _progress = 0;
    // 随机最大进度阈值，70%～90%之间
    const _maxProgress = 0.7 + Math.random() * 0.2;
    // 分片任务队列
    const _partList: Array<Fn> = [];

    // 模拟上传进度
    function update_progress() {
        // 文件大小对100M的倍率
        const _ratio = _fileSize / (1000 * 1024 * 1024);
        // 随机秒数，1～5秒乘以倍率
        const _randomSecond = (1 + Math.random() * 4) * 1000 * _ratio;
        _progressTimer = setTimeout(() => {
            // 总进度每次增加1%，超过最大进度阈值时显示真实进度
            _progress += 0.01;
            _progress < _maxProgress && update_progress();
            onProgress && onProgress(_progress);
        }, _randomSecond);
    }

    // 上传分片
    function upload(params: IUploadApiReq) {
        return new Promise((resolve, reject) => {
            uploadParams.uploadApi(params)
                .then(async(res: IResult) => {
                    if (res?.data?.code === 200) {
                        _successTotal += 1;
                        // 计算上传进度
                        _progress = Math.max(_successTotal / _chunkTotal, _progress);
                        onProgress && onProgress(_progress);
                        resolve(res.data);
                    } else {
                        reject(res?.data);
                    }
                });
        });
    }

    /* 分片上传 */
    async function multipart_upload(resolve: (value: unknown) => void, reject: (value: unknown) => void) {
        try {
            // 配置参数校验
            if (uploadParams.partSize && uploadParams.partSize < 1024 * 1024) {
                throw Error('分片大小设置过小，范围是1~100MB，参数单位为字节');
            } else if (uploadParams.partSize && uploadParams.partSize > 100 * 1024 * 1024) {
                throw Error('分片大小设置过大，范围是1~100MB，参数单位为字节');
            } else if (_chunkTotal > 1000) {
                throw Error('分片大小设置过小，分片总数超出最大数量，最大数量为1000');
            }
            // 获取上传Id
            const _initReq: IInitApiReq = {
                dir: 'pri-asset-application',
                name: sourceFile.name
            };
            const _initRes = await uploadParams.initApi(_initReq);
            if (_initRes?.code === 200) {
                _uploadId = _initRes.data.upload_id;
            } else {
                throw Error(_initRes);
            }
            update_progress();
            // 并行上传分片
            while (_start < _fileSize) {
                // 计算切割位置
                _end = _start + _chunkSize;
                if (_end > _fileSize) {
                    _end = _fileSize;
                }
                // 文件切片
                const _chunk = sourceFile.slice(_start, _end);
                // 生成切片上传队列
                const _uploadReq: IUploadApiReq = {
                    upload_id: _uploadId,
                    part_number: _chunkIndex + 1,
                    part_size: _chunkSize,
                    file: _chunk
                };
                _partList.push(() => upload(_uploadReq));
                // 更新计数
                _start = _end;
                _chunkIndex++;
            }
            // 设置同时最多并发6个上传请求（chrome浏览器最大只支持6个同域并发请求）
            request_control(_partList, 6)
                .then(async() => {
                    // 合并段
                    const _mergeReq: IMergeApiReq = {
                        upload_id: _uploadId
                    };
                    const _mergeRes = await uploadParams.mergeApi(_mergeReq);
                    if (_mergeRes?.code === 200) {
                        resolve({
                            url: _mergeRes.data.url
                        });
                    } else {
                        reject(_mergeRes);
                    }
                })
                .catch(err => {
                    reject(err);
                });
        } catch (err) {
            reject(err);
        }
    }
    return new Promise((resolve, reject) => multipart_upload(resolve, reject));
}

// Promise.all的并发数控制
function request_control(fnList: any[], max: number) {
    // 请求队列
    const _len = fnList.length;
    // 请求成功数
    let _count = 0;
    // 最大并发数
    const _limitNum = Math.min(_len, max);
    // 是否有失败请求
    let _hasError = false;

    return new Promise((resolve, reject) => {
        for (let _i = 0; _i < _limitNum; _i++) {
            calc(fnList.shift());
        }
        // 调用执行函数获取结果
        function calc(fn: Fn) {
            Promise.resolve(fn())
                .then(() => {
                    _count++;
                    if (_count === _len) {
                        resolve(true);
                    } else {
                        // 无失败请求 且 请求队列不为空
                        !_hasError && fnList.length && calc(fnList.shift());
                    }
                })
                .catch(err => {
                    _hasError = true;
                    clearTimeout(_progressTimer);
                    reject(err);
                });
        }
    });
}
