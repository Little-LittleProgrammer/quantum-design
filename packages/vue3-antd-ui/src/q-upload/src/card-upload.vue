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
                <video :src="data.imageUrl" v-if="data.fileType === 'video'"></video>
                <img :src="data.imageUrl" alt="avatar" v-else/>
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
            <div v-else class="icon">
                <q-icon :type="data.uploadLoading ? 'LoadingOutlined' : 'PlusOutlined'" />
            </div>
        </a-upload>
        <slot name="right" v-if="props.rightShow">
            <div class="upload-right">
                <span v-if="isString(markWord)">{{markWord}}</span>
                <template v-else>
                    <div v-for="item in markWord" :key="item">
                        <span>{{item}}</span>
                    </div>
                </template>
            </div>
        </slot>
        <a-modal :visible="data.modalVisible" :footer="null" @cancel="close_modal">
            <video style="width: 100%; height: 100%;" controls muted :src="data.modalImageUrl" v-if="data.fileType === 'video'"></video>
            <img style="width: 100%; height: 100%;" v-else :src="data.modalImageUrl" alt="">
        </a-modal>
    </div>
</template>

<script lang="ts" setup>
import { useMessage } from '@qmfront/hooks/vue';
import { propTypes } from '@qmfront/types/vue/types';
import { isString } from '@qmfront/utils';
import { PropType, reactive, watch } from 'vue';
import {QIcon} from '@/q-icon';
import './style/index.scss';
interface DataProps {
    uploadLoading: boolean
    imageUrl: string
    imgFlag: boolean
    fileType: string
    getHover: boolean
    modalImageUrl: string
    modalVisible: boolean
}
const props = defineProps({
    markWord: propTypes.any.def('格式要求PNG'),
    value: propTypes.string.def(''),
    accept: propTypes.string.def(''),
    maxSize: propTypes.number.def(0),
    rightShow: propTypes.bool.def(false),
    uploadApi: {
        type: Function as PropType<(params: UploadFileParams)=> any>,
        default: () => {}
    }
});
const emit = defineEmits(['update:value', 'change']);
const { createMessage } = useMessage();
const data: DataProps = reactive({
    uploadLoading: false,
    imageUrl: '',
    imgFlag: true,
    fileType: '',
    getHover: false,
    modalVisible: false,
    modalImageUrl: ''
});
function set_class(flag: boolean) {
    data.getHover = flag;
}
function open_modal(e: ChangeEvent) {
    e.stopPropagation();
    data.modalVisible = true;
    data.modalImageUrl = data.imageUrl;
}
function close_modal() {
    data.modalVisible = false;
}
function before_upload(file: File) {
    let _flag = true;
    if (props.maxSize !== 0 && file.size > props.maxSize * 1024) {
        createMessage.error(`上传文件的大小不得大于${props.maxSize >= 1024 ? (props.maxSize / 1024) + 'M' : props.maxSize + 'K'}`);
    }
    if (props.accept != '') {
        if (!props.accept.includes(file.type)) {
            createMessage.error('请上传 ' + props.accept + ' 格式的文件');
            _flag = false;
        }
    }
    return _flag;
}
async function upload_file(option: UploadFileParams) {
    data.imgFlag = true;
    // 上传图片
    data.uploadLoading = true;
    const _file = option.file;
    const _req = {
        action: 'upload',
        imageFile: _file,
        file: _file
    };
    option.onProgress(); // 进度条
    try {
        const _res = await props.uploadApi(_req);
        if (_res.data.code != 200) {
            data.uploadLoading = false;
            option.onError(); // 上传失败
            return;
        }
        option.onSuccess(); // 上传成功
        data.imgFlag = false;
        emit('update:value', _res.data.data.path);
        emit('change', _res.data.data.path);
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
    if (info?.file.type.includes('image')) {
        data.fileType = 'image';
    } else {
        data.fileType = 'video';
    }
    if (info.file.status === 'uploading') {
        data.uploadLoading = true;
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
    emit('update:value', '');
    emit('change', '');
}
watch(() => props.value, (val) => {
    if (data.imgFlag) {
        if (val.includes('cdn')) {
            data.imageUrl = val || '';
            data.fileType = (val.includes('video') || val.includes('.mp4')) ? 'video' : 'image';
        } else {
            data.imageUrl = '';
        }
    }
}, {
    immediate: true
});
</script>
