<!--  -->
<template>
    <div class="content-script">
        <Button @click="handler_click">查看接口</Button>
        <Modal class="g-w-800" :closable="false" okText="复制" :visible="data.visible" @ok="copy_interface" @cancel="() =>data.visible = false">
            <Code :code="data.code"></Code>
        </Modal>
    </div>
</template>

<script lang='ts' setup>
import { reactive } from 'vue';
import { Button, Modal, message } from 'ant-design-vue';
import { api_get_detail } from '../utils/http';
import { path_to_pascal_interface } from '../utils/tools';
import { FactoryJson } from '../utils/factory-json-divide';
import Code from './components/code.vue';
import { js_utils_copy_code } from '@quantum-design/utils';

const data = reactive({
    code: '',
    visible: false
});

async function handler_click() {
    data.code = '';
    const _res = await api_get_detail();
    if (_res && _res.errcode !== 0) {
        message.error(_res.errmsg);
        return;
    }
    if (_res && _res.errcode === 0) {
        const _tsType = {
            reqType: '',
            resType: ''
        };
        if (!(_res.data.res_body_type === 'json')) {
            message.error('暂不支持返回值格式不是json格式的接口');
            return;
        }
        if (_res.data.res_body_type === 'json') {
            const _resSchemas = JSON.parse(_res.data.res_body);
            const _nameRes = path_to_pascal_interface(_res.data.path) + 'Res';
            _tsType.resType = new FactoryJson(_nameRes, _resSchemas, '响应 ' + _res.data.path.slice(1)).get();
        }
        if (_res.data.req_body_type === 'json') {
            const _reqSchema = JSON.parse(_res.data.req_body_other || '');
            const _nameReq = path_to_pascal_interface(_res.data.path) + 'Req';
            _tsType.reqType = new FactoryJson(_nameReq, _reqSchema, '请求').get();
        }
        for (const [key, val] of Object.entries(_tsType)) {
            if (key === 'reqType') {
                data.code += `${val}`;
            } else {
                data.code += `\n ${val}`;
            }
        }
        console.log('data.code', data.code);
        data.visible = true;
    }
}

function copy_interface() {
    js_utils_copy_code(data.code);
}

</script>
<style lang='scss' scoped>
.content-script {
    width: auto;
    height: 44px;
}
</style>
../utils/factory-json-divide
