<!--  -->
<template>
    <div class="popup">
       <span> 仅在Yapi的具体接口页面生效, 点击查看接口按钮查看</span>
        <div class="popup-form">
            yapiToken:
            <p v-for="item in Object.keys(data.token)" :key="item">
                {{item}}: <Input style="width: 240px" v-model:value="data.token[item]" placeholder="请输入token" @change="e => change_input(e, item)"></Input>
            </p>
            <Button size="small" @click="add_token">添加</Button>
        </div>
    </div>
</template>

<script lang='ts' setup>
import { onMounted, reactive } from 'vue';
import { Input, Button } from 'ant-design-vue';
import 'ant-design-vue/lib/input/style';
import Browser from 'webextension-polyfill';
const data = reactive({
    token: {} as any
});

const ls = Browser.storage.local;

async function change_input(e: any, projectId: string) {
    const _token = (await ls.get()).token || {};
    if (!e.target.value) {
        delete _token[projectId];
    } else {
        _token[projectId] = e.target.value;
    }
    ls.set({
        token: _token
    });
    console.log(_token);
}
async function add_token() {
    Browser.tabs.query({active: true, url: 'http://yapi.km.com/project/*'}).then((tabs) => {
        const _currentUrl = tabs[0].url;
        console.log(_currentUrl);
        if (_currentUrl) {
            const _ids = _currentUrl.replace(/\D/g, '/').split('/').filter(item => item);
            const _projectId = _ids[0];
            if (!_projectId) {
                alert('请在yapi的具体项目页面设置token');
                return;
            }
            data.token[_projectId] = '';
        }
    });
}

onMounted(async() => {
    const _local = (await ls.get()).token;
    console.log(_local);
    if (_local) {
        data.token = _local;
    }
});

</script>
<style lang='scss' scoped>
.popup {
    width: 300px;
    padding: 10px;
    &-form {
        margin-top: 20px;
    }
}
</style>
