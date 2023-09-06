<!--  -->
<template>
    <div class="q-upload q-card-upload">
        <a-upload
            listType="picture-card"
            class="avatar-uploader"
            :showUploadList="false"
            :accept="accept"
            :before-upload="before_upload"
            :customRequest="upload_file"
            @change="handle_change">
            <div v-if="!data.uploadLoading && data.imageUrl" class="show-img" :class="{hover: data.getHover}" @mouseenter="set_class(true)" @mouseleave="set_class(false)">
                <video :src="data.fullUrl || data.imageUrl" v-if="data.fileType === 'video'"></video>
                <img :src="data.fullUrl || data.imageUrl" alt="avatar" v-else-if="data.fileType === 'image'"/>
                <div class="file-desc" v-else>
                    <q-icon type="FileOutlined"></q-icon>
                    <p>{{ data.fileName }}</p>
                </div>
                <div class="mask qm-flex-center" v-if="data.getHover">
                    <a-button type="link" @click="open_modal">
                        <template #icon>
                            <q-icon type="EyeOutlined"></q-icon>
                        </template>
                    </a-button>
                    <a-button type="link" @click="remove_img">
                        <template #icon>
                            <q-icon type="DeleteOutlined"></q-icon>
                        </template>
                    </a-button>
                </div>
            </div>
            <div v-else-if="data.uploadLoading" class="icon">
                <q-icon type="LoadingOutlined" />
            </div>
            <slot v-else>
                <div class="icon">
                    <q-icon type="PlusOutlined" />
                </div>
            </slot>
        </a-upload>
        <slot name="right" v-if="props.rightShow">
            <div class="upload-right">
                <span v-if="js_is_string(markWord)">{{markWord}}</span>
                <template v-else>
                    <div v-for="item in markWord" :key="item">
                        <span>{{item}}</span>
                    </div>
                </template>
            </div>
        </slot>
        <a-modal class="preview" :visible="data.modalVisible" :footer="null" @cancel="close_modal">
            <video style="width: 100%; height: 100%;" controls muted :src="data.modalImageUrl" v-if="data.fileType === 'video'"></video>
            <img style="width: 100%; height: 100%;" v-else :src="data.modalImageUrl" alt="">
        </a-modal>
    </div>
</template>

<script lang="ts" setup>
import { useMessage } from '@q-front-npm/hooks/vue';
import { propTypes } from '@q-front-npm/types/vue/types';
import { js_is_function, js_is_string, js_is_image, js_is_video } from '@q-front-npm/utils';
import { PropType, reactive, watch } from 'vue';
import {Icon as QIcon} from '@/q-icon/src/icon';
import './style/index.scss';
defineOptions({
    name: 'QAntdCardUpload'
});
interface DataProps {
    uploadLoading: boolean
    imageUrl: string
    imgFlag: boolean
    fileType: '' | 'image' | 'video' | 'other'
    fileName: string
    getHover: boolean
    modalImageUrl: string
    modalVisible: boolean
    fullUrl: string
}
interface ILimit {
    type: 'size' | 'ratio' | 'maxSize', // size为固定宽高，ratio为各比例
    width?: number,
    height?: number,
    minDuration?: number,
    maxDuration?: number,
    message?: string
}
const props = defineProps({
    markWord: propTypes.any.def('格式要求PNG'),
    value: propTypes.string.def(''),
    fullUrl: propTypes.string.def(''), // 带http的
    accept: propTypes.string.def(''),
    acceptMessage: propTypes.string.def(''),
    maxSize: propTypes.number.def(0),
    maxSizeMessage: propTypes.string.def(''),
    limit: {
        type: Object as PropType<ILimit>
    },
    rightShow: propTypes.bool.def(false),
    uploadApi: {
        type: Function as PropType<(params: UploadFileParams)=> any>,
        default: () => {}
    },
    curstomApiParams: {
        type: Object,
        default: () => {}
    },
    customBeforeUpload: {
        type: Function as PropType<(file: File) => boolean | Promise<any>>
    }
});
const emit = defineEmits(['update:value', 'change', 'validatedFile']);
const { createMessage } = useMessage();
const data: DataProps = reactive({
    uploadLoading: false,
    imageUrl: '',
    imgFlag: true,
    fileType: '',
    fileName: '',
    getHover: false,
    modalVisible: false,
    modalImageUrl: '',
    fullUrl: ''
});
function set_class(flag: boolean) {
    data.getHover = flag;
}
function open_modal(e: ChangeEvent) {
    e.stopPropagation();
    if (data.fileType === 'other') {
        window.open(data.fullUrl || data.imageUrl);
        return;
    }
    data.modalVisible = true;
    data.modalImageUrl = data.imageUrl;
}
function close_modal() {
    data.modalVisible = false;
}
async function before_upload(file: File) {
    // 校验文件类型（如图片类型传递 image/png 或者 .png 均可通过校验）
    if (props.accept != '' && !(props.accept.includes(file.type) || props.accept.includes('.' + file.name.toLowerCase().split('.').at(-1)))) {
        createMessage.error(props.acceptMessage || `请上传 ${props.accept} 格式的文件`);
        return false;
    }
    // 校验文件大小
    if (props.maxSize !== 0 && file.size > props.maxSize * 1024) {
        createMessage.error(props.maxSizeMessage || `上传文件的大小不得大于${props.maxSize >= 1024 ? (props.maxSize / 1024) + 'M' : props.maxSize + 'K'}`);
        return false;
    }
    // 校验文件宽高
    if (props.limit) {
        const isVideoType = file.type.includes('video') || file.type.includes('.mp4');
        const _res = isVideoType ? await check_video_valide(file, props.limit) : await check_image_wh(file, props.limit);
        if (!_res) {
            createMessage.error(props.limit.message || '上传文件尺寸不符合要求');
            return false;
        }
        // 返回文件详细信息
        emit('validatedFile', _res);
    }
    // 自定义上传前校验事件，可返回boolean或promise
    if (js_is_function(props.customBeforeUpload)) {
        let _flag: boolean | Promise<any> = true;
        _flag = props.customBeforeUpload(file);
        return _flag;
    }
}
// 校验图片宽高
function check_image_wh(file: File, limit: ILimit) {
    return new Promise((resolve, reject) => {
        const _fileReader = new FileReader();
        _fileReader.readAsDataURL(file);
        _fileReader.onload = (e: any) => {
            const _src = e.target.result;
            const _image = new Image();
            _image.onload = function() {
                if (limit.type === 'size') {
                    if (limit.width && limit.height) {
                        return _image.width === limit.width && _image.height === limit.height ? resolve(_image) : resolve(false);
                    } else if (limit.width) {
                        return _image.width === limit.width ? resolve(_image) : resolve(false);
                    } else {
                        return _image.height === limit.height ? resolve(_image) : resolve(false);
                    }
                } else if (limit.type === 'maxSize') {
                    if (limit.width && limit.height) {
                        return _image.width <= limit.width && _image.height <= limit.height ? resolve(_image) : resolve(false);
                    } else if (limit.width) {
                        return _image.width <= limit.width ? resolve(_image) : resolve(false);
                    } else if (limit.height) {
                        return _image.height <= limit.height ? resolve(_image) : resolve(false);
                    }
                } else {
                    return (_image.width / _image.height) === (Number(limit.width) / Number(limit.height)) ? resolve(_image) : resolve(false);
                }
            };
            _image.onerror = reject;
            _image.src = _src;
        };
    });
}
// 校验视频宽高或时长
function check_video_valide(file: File, limit: ILimit) {
    return new Promise(function(resolve, reject) {
        const _url = URL.createObjectURL(file);
        const _video = document.createElement('video');
        _video.onloadedmetadata = (e: any) => {
            URL.revokeObjectURL(_url);
            const duration = Math.round(_video.duration);
            if (duration < Number(limit.minDuration) || duration > Number(limit.maxDuration)) {
                reject();
            }
            if (limit.type === 'size') {
                if (limit.width && limit.height) {
                    return e.target.videoWidth === limit.width && e.target.videoHeight === limit.height ? resolve(e.target) : resolve(false);
                } else if (limit.width) {
                    return e.target.videoWidth === limit.width ? resolve(e.target) : resolve(false);
                } else {
                    return e.target.videoHeight === limit.height ? resolve(e.target) : resolve(false);
                }
            } else if (limit.type === 'maxSize') {
                if (limit.width && limit.height) {
                    return e.target.videoWidth <= limit.width && e.target.videoHeight <= limit.height ? resolve(e.target) : resolve(false);
                } else if (limit.width) {
                    return e.target.videoWidth <= limit.width ? resolve(e.target) : resolve(false);
                } else if (limit.height) {
                    return e.target.videoHeight <= limit.height ? resolve(e.target) : resolve(false);
                }
            } else {
                return (e.target.videoWidth / e.target.videoHeight) === (Number(limit.width) / Number(limit.height)) ? resolve(e.target) : resolve(false);
            }
        };
        _video.src = _url;
        _video.load();
    }).catch(
        () => {
            createMessage.error('上传视频时长不符合要求');
            return Promise.reject();
        }
    );
}
async function upload_file(option: UploadFileParams) {
    data.imgFlag = true;
    // 上传图片
    data.uploadLoading = true;
    const _file = option.file;
    const _req = {
        action: 'upload',
        file: _file,
        ...props.curstomApiParams
    };
    option.onProgress(); // 进度条
    try {
        const _res = await props.uploadApi(_req);
        if (_res.data.code != 200) {
            data.uploadLoading = false;
            option.onError(); // 上传失败
            createMessage.error(_res.data.msg);
            return;
        }
        option.onSuccess(); // 上传成功
        data.imgFlag = false;
        data.fullUrl = '';
        data.fileName = option.file.name;
        emit('update:value', _res.data.data.url);
        emit('change', _res.data.data.url, option);
        createMessage.success(_res.data.msg);
    } catch (e) {
        data.uploadLoading = false;
    }
}
function get_base64(img: Blob, callback: Function) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}
function handle_change(info: any) {
    if (info.file.status === 'uploading') {
        data.uploadLoading = true;
        if (info?.file.type.includes('image')) {
            data.fileType = 'image';
        } else if (js_is_video(info?.file.name)) {
            data.fileType = 'video';
        } else {
            data.fileType = 'other';
        }
        return;
    }
    if (info.file.status === 'done') {
        get_base64(info.file.originFileObj, (imageUrl: string) => {
            data.uploadLoading = false;
            data.imageUrl = imageUrl;
        });
    }
}
function remove_img(e: ChangeEvent) {
    e.stopPropagation();
    data.imageUrl = '';
    data.fullUrl = '';
    emit('update:value', '');
    emit('change', '');
}

watch(() => props.value, (val) => {
    if (data.imgFlag) {
        if (val.includes('http')) {
            data.imageUrl = val || '';
            data.fileType = js_is_image(val) ? 'image' : (js_is_video(val) ? 'video' : 'other');
            data.fileName = val.split('/').at(-1) || '';
        } else {
            data.imageUrl = val || '';
        }
    }
    if (!val) {
        data.imageUrl = '';
    }
}, {
    immediate: true
});

watch(() => props.fullUrl, (val) => {
    if (val) {
        data.fullUrl = val;
        data.fileType = js_is_image(val) ? 'image' : (js_is_video(val) ? 'video' : 'other');
        data.fileName = val.split('/').at(-1) || '';
    }
}, {immediate: true});

// 对父组件暴露图片/视频校验方法，可用于自定义校验规则
defineExpose({
    check_image_wh, check_video_valide
});
</script>
