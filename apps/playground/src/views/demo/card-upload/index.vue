<template>
    <div class="card-upload-demo">
        <a-card title="基础用法" class="g-mt">
            <div class="upload-section">
                <div style="margin-bottom: 16px">
                    <p>基本的卡片式文件上传组件：</p>
                </div>
                <q-antd-card-upload :file-list="basicFileList" :max-count="3" @change="onBasicUploadChange" @preview="onPreview">
                    <div class="upload-placeholder">
                        <plus-outlined />
                        <div>上传文件</div>
                    </div>
                </q-antd-card-upload>
            </div>
        </a-card>

        <a-card title="图片上传" class="g-mt">
            <div class="upload-section">
                <div style="margin-bottom: 16px">
                    <p>专门用于图片上传，支持预览和格式限制：</p>
                </div>
                <q-antd-card-upload :file-list="imageFileList" :max-count="5" accept="image/*" list-type="picture-card" @change="onImageUploadChange" @preview="onPreview">
                    <div class="upload-placeholder">
                        <camera-outlined />
                        <div>上传图片</div>
                    </div>
                </q-antd-card-upload>
            </div>
        </a-card>

        <a-card title="拖拽上传" class="g-mt">
            <div class="upload-section">
                <div style="margin-bottom: 16px">
                    <a-space>
                        <a-switch v-model:checked="dragEnabled" />
                        <span>启用拖拽上传</span>
                    </a-space>
                </div>
                <q-antd-card-upload :file-list="dragFileList" :max-count="3" :drag="dragEnabled" @change="onDragUploadChange" @drop="onDrop">
                    <div class="upload-placeholder drag-placeholder">
                        <inbox-outlined style="font-size: 48px; color: #999" />
                        <div style="margin-top: 16px">
                            <div>点击或拖拽文件到此区域上传</div>
                            <div style="color: #999; font-size: 12px">支持单个或批量上传</div>
                        </div>
                    </div>
                </q-antd-card-upload>
            </div>
        </a-card>

        <a-card title="文件类型限制" class="g-mt">
            <div class="upload-section">
                <div style="margin-bottom: 16px">
                    <a-space wrap>
                        <span>允许的文件类型:</span>
                        <a-radio-group v-model:value="fileType" @change="onFileTypeChange">
                            <a-radio value="image">图片 (.jpg, .png, .gif)</a-radio>
                            <a-radio value="document">文档 (.pdf, .doc, .txt)</a-radio>
                            <a-radio value="video">视频 (.mp4, .avi, .mov)</a-radio>
                            <a-radio value="all">所有类型</a-radio>
                        </a-radio-group>
                    </a-space>
                </div>
                <q-antd-card-upload :file-list="typeFileList" :max-count="3" :accept="currentAccept" :before-upload="beforeUpload" @change="onTypeUploadChange">
                    <div class="upload-placeholder">
                        <file-add-outlined />
                        <div>上传 {{ fileTypeText }}</div>
                    </div>
                </q-antd-card-upload>
            </div>
        </a-card>

        <a-card title="文件大小限制" class="g-mt">
            <div class="upload-section">
                <div style="margin-bottom: 16px">
                    <a-space>
                        <span>最大文件大小:</span>
                        <a-select v-model:value="maxSize" style="width: 120px">
                            <a-select-option :value="1">1MB</a-select-option>
                            <a-select-option :value="5">5MB</a-select-option>
                            <a-select-option :value="10">10MB</a-select-option>
                            <a-select-option :value="50">50MB</a-select-option>
                        </a-select>
                    </a-space>
                </div>
                <q-antd-card-upload :file-list="sizeFileList" :max-count="3" :before-upload="beforeUploadSize" @change="onSizeUploadChange">
                    <div class="upload-placeholder">
                        <cloud-upload-outlined />
                        <div>上传文件</div>
                        <div style="color: #999; font-size: 12px">最大 {{ maxSize }}MB</div>
                    </div>
                </q-antd-card-upload>
            </div>
        </a-card>

        <a-card title="自定义上传逻辑" class="g-mt">
            <div class="upload-section">
                <div style="margin-bottom: 16px">
                    <a-space>
                        <a-button type="primary" @click="uploadToCloud">上传到云存储</a-button>
                        <a-button @click="clearCustomFiles">清空文件</a-button>
                        <span>上传进度: {{ uploadProgress }}%</span>
                    </a-space>
                </div>
                <q-antd-card-upload :file-list="customFileList" :max-count="3" :custom-request="customUpload" @change="onCustomUploadChange">
                    <div class="upload-placeholder">
                        <rocket-outlined />
                        <div>自定义上传</div>
                    </div>
                </q-antd-card-upload>
            </div>
        </a-card>

        <a-card title="批量操作" class="g-mt">
            <div class="upload-section">
                <div style="margin-bottom: 16px">
                    <a-space>
                        <a-button type="primary" @click="selectAllFiles">全选</a-button>
                        <a-button @click="removeSelectedFiles">删除选中</a-button>
                        <a-button @click="downloadSelectedFiles">下载选中</a-button>
                        <span>已选择: {{ selectedFiles.length }} 个文件</span>
                    </a-space>
                </div>
                <q-antd-card-upload :file-list="batchFileList" :max-count="10" multiple @change="onBatchUploadChange" @preview="onPreview">
                    <div class="upload-placeholder">
                        <folder-add-outlined />
                        <div>批量上传</div>
                    </div>
                </q-antd-card-upload>
                <div style="margin-top: 16px">
                    <a-checkbox-group v-model:value="selectedFiles" style="width: 100%">
                        <a-row :gutter="[16, 16]">
                            <a-col :span="8" v-for="file in batchFileList" :key="file.uid">
                                <a-checkbox :value="file.uid">
                                    <div class="file-item">
                                        <file-outlined />
                                        <span>{{ file.name }}</span>
                                    </div>
                                </a-checkbox>
                            </a-col>
                        </a-row>
                    </a-checkbox-group>
                </div>
            </div>
        </a-card>

        <a-card title="上传状态展示" class="g-mt">
            <div class="upload-section">
                <div style="margin-bottom: 16px">
                    <a-space>
                        <a-button @click="simulateUploadSuccess">模拟上传成功</a-button>
                        <a-button @click="simulateUploadError">模拟上传失败</a-button>
                        <a-button @click="clearStatusFiles">清空文件</a-button>
                    </a-space>
                </div>
                <q-antd-card-upload :file-list="statusFileList" :max-count="5" @change="onStatusUploadChange">
                    <div class="upload-placeholder">
                        <loading-outlined v-if="uploading" />
                        <upload-outlined v-else />
                        <div>{{ uploading ? '上传中...' : '上传文件' }}</div>
                    </div>
                </q-antd-card-upload>
            </div>
        </a-card>

        <!-- 预览模态框 -->
        <a-modal v-model:open="previewVisible" :footer="null" :title="previewTitle">
            <img v-if="isImage(previewFile)" :src="previewImage" style="width: 100%" />
            <div v-else style="text-align: center; padding: 20px">
                <file-outlined style="font-size: 48px; color: #999" />
                <div style="margin-top: 16px">{{ previewFile?.name }}</div>
                <div style="color: #999; margin-top: 8px">无法预览此文件类型</div>
            </div>
        </a-modal>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { QAntdCardUpload } from '@quantum-design/vue3-antd-pc-ui';
import { Card as ACard, Space as ASpace, Switch as ASwitch, RadioGroup as ARadioGroup, Radio as ARadio, Select as ASelect, SelectOption as ASelectOption, Button as AButton, CheckboxGroup as ACheckboxGroup, Checkbox as ACheckbox, Row as ARow, Col as ACol, Modal as AModal, message } from 'ant-design-vue';
import { PlusOutlined, CameraOutlined, InboxOutlined, FileAddOutlined, CloudUploadOutlined, RocketOutlined, FolderAddOutlined, FileOutlined, LoadingOutlined, UploadOutlined } from '@ant-design/icons-vue';

defineOptions({
    name: 'CardUploadDemo'
});

// 基础上传
const basicFileList = ref([]);

// 图片上传
const imageFileList = ref([]);

// 拖拽上传
const dragEnabled = ref(true);
const dragFileList = ref([]);

// 文件类型限制
const fileType = ref('image');
const typeFileList = ref([]);

const fileTypeConfig = {
    image: { accept: 'image/*', text: '图片文件' },
    document: { accept: '.pdf,.doc,.docx,.txt', text: '文档文件' },
    video: { accept: 'video/*', text: '视频文件' },
    all: { accept: '*', text: '所有文件' }
};

const currentAccept = computed(() => fileTypeConfig[fileType.value].accept);
const fileTypeText = computed(() => fileTypeConfig[fileType.value].text);

// 文件大小限制
const maxSize = ref(5);
const sizeFileList = ref([]);

// 自定义上传
const customFileList = ref([]);
const uploadProgress = ref(0);

// 批量操作
const batchFileList = ref([]);
const selectedFiles = ref([]);

// 上传状态
const statusFileList = ref([]);
const uploading = ref(false);

// 预览相关
const previewVisible = ref(false);
const previewImage = ref('');
const previewTitle = ref('');
const previewFile = ref(null);

// 基础上传事件
function onBasicUploadChange({ fileList }) {
    basicFileList.value = fileList;
    console.log('基础上传文件变化:', fileList);
}

// 图片上传事件
function onImageUploadChange({ fileList }) {
    imageFileList.value = fileList;
    console.log('图片上传文件变化:', fileList);
}

// 拖拽上传事件
function onDragUploadChange({ fileList }) {
    dragFileList.value = fileList;
    console.log('拖拽上传文件变化:', fileList);
}

function onDrop(e) {
    console.log('拖拽释放文件:', e.dataTransfer.files);
    message.info('检测到拖拽文件，开始上传');
}

// 文件类型限制事件
function onFileTypeChange() {
    typeFileList.value = [];
    message.info(`已切换到${fileTypeText.value}上传模式`);
}

function onTypeUploadChange({ fileList }) {
    typeFileList.value = fileList;
}

function beforeUpload(file) {
    const allowedTypes = {
        image: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
        document: ['application/pdf', 'application/msword', 'text/plain'],
        video: ['video/mp4', 'video/avi', 'video/quicktime'],
        all: []
    };

    if (fileType.value !== 'all' && allowedTypes[fileType.value].length > 0) {
        const isAllowed = allowedTypes[fileType.value].includes(file.type);
        if (!isAllowed) {
            message.error(`只能上传${fileTypeText.value}！`);
            return false;
        }
    }
    return true;
}

// 文件大小限制事件
function onSizeUploadChange({ fileList }) {
    sizeFileList.value = fileList;
}

function beforeUploadSize(file) {
    const isLtMaxSize = file.size / 1024 / 1024 < maxSize.value;
    if (!isLtMaxSize) {
        message.error(`文件大小不能超过 ${maxSize.value}MB！`);
        return false;
    }
    return true;
}

// 自定义上传逻辑
function onCustomUploadChange({ fileList }) {
    customFileList.value = fileList;
}

function customUpload({ file, onProgress, onSuccess }) {
    // 模拟自定义上传过程
    uploadProgress.value = 0;

    const interval = setInterval(() => {
        uploadProgress.value += 10;
        onProgress({ percent: uploadProgress.value });

        if (uploadProgress.value >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                onSuccess({
                    url: `https://example.com/files/${file.name}`,
                    status: 'done'
                });
                message.success(`${file.name} 上传成功！`);
                uploadProgress.value = 0;
            }, 500);
        }
    }, 200);

    return {
        abort() {
            clearInterval(interval);
            uploadProgress.value = 0;
        }
    };
}

function uploadToCloud() {
    if (customFileList.value.length === 0) {
        message.warning('请先选择文件');
        return;
    }
    message.info('开始上传到云存储...');
}

function clearCustomFiles() {
    customFileList.value = [];
    uploadProgress.value = 0;
}

// 批量操作事件
function onBatchUploadChange({ fileList }) {
    batchFileList.value = fileList;
}

function selectAllFiles() {
    selectedFiles.value = batchFileList.value.map((file) => file.uid);
}

function removeSelectedFiles() {
    if (selectedFiles.value.length === 0) {
        message.warning('请先选择要删除的文件');
        return;
    }

    batchFileList.value = batchFileList.value.filter((file) => !selectedFiles.value.includes(file.uid));
    selectedFiles.value = [];
    message.success(`已删除 ${selectedFiles.value.length} 个文件`);
}

function downloadSelectedFiles() {
    if (selectedFiles.value.length === 0) {
        message.warning('请先选择要下载的文件');
        return;
    }

    message.info(`开始下载 ${selectedFiles.value.length} 个文件`);
    // 这里可以实现实际的下载逻辑
}

// 上传状态事件
function onStatusUploadChange({ fileList }) {
    statusFileList.value = fileList;
}

function simulateUploadSuccess() {
    uploading.value = true;

    const mockFile = {
        uid: Date.now().toString(),
        name: `success-file-${Date.now()}.jpg`,
        status: 'uploading',
        percent: 0
    };

    statusFileList.value.push(mockFile);

    const interval = setInterval(() => {
        mockFile.percent += 20;
        if (mockFile.percent >= 100) {
            clearInterval(interval);
            mockFile.status = 'done';
            mockFile.url = 'https://example.com/success-image.jpg';
            uploading.value = false;
            message.success('上传成功！');
        }
    }, 300);
}

function simulateUploadError() {
    uploading.value = true;

    const mockFile = {
        uid: Date.now().toString(),
        name: `error-file-${Date.now()}.jpg`,
        status: 'uploading',
        percent: 0
    };

    statusFileList.value.push(mockFile);

    setTimeout(() => {
        mockFile.status = 'error';
        mockFile.response = '上传失败：网络错误';
        uploading.value = false;
        message.error('上传失败！');
    }, 2000);
}

function clearStatusFiles() {
    statusFileList.value = [];
    uploading.value = false;
}

// 预览功能
function onPreview(file) {
    previewFile.value = file;
    previewImage.value = file.url || file.thumbUrl;
    previewVisible.value = true;
    previewTitle.value = file.name;
}

function isImage(file) {
    if (!file) return false;
    return file.type?.startsWith('image/') || file.name?.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i);
}
</script>

<style lang="scss" scoped>
.card-upload-demo {
    padding: 16px;
}

.upload-section {
    padding: 16px 0;
}

.upload-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    border: 2px dashed #d9d9d9;
    border-radius: 6px;
    background: #fafafa;
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
        border-color: #1890ff;
        background: #f0f8ff;
    }

    .anticon {
        font-size: 24px;
        color: #999;
        margin-bottom: 8px;
    }

    > div {
        color: #666;
        font-size: 14px;
    }
}

.drag-placeholder {
    min-height: 120px;
    border-style: dashed;

    &:hover {
        border-color: #40a9ff;
    }
}

.file-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 0;

    .anticon {
        color: #1890ff;
    }

    span {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}

// 自定义上传组件样式
:deep(.ant-upload-list) {
    .ant-upload-list-item {
        transition: all 0.3s ease;

        &:hover {
            background: #f5f5f5;
        }
    }

    .ant-upload-list-item-error {
        border-color: #ff4d4f;
        background: #fff2f0;
    }

    .ant-upload-list-item-done {
        border-color: #52c41a;
    }
}

:deep(.ant-upload-drag) {
    &.ant-upload-drag-hover {
        border-color: #40a9ff;
        background: #f0f8ff;
    }
}

// 响应式设计
@media (max-width: 768px) {
    .upload-placeholder {
        padding: 16px;

        .anticon {
            font-size: 20px;
        }

        > div {
            font-size: 12px;
        }
    }

    .drag-placeholder {
        min-height: 100px;

        .anticon {
            font-size: 36px !important;
        }
    }
}
</style>
