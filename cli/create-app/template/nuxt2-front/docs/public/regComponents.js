export default {
    install (Vue) {
        // 读取项目组件文件夹, 可替换全局组件所在目录
        const _req = require.context(`~/components/global`, false, /\.vue$/);
        // 将业务组件注册为全局组件
        _req.keys().forEach(_f => {
            const _name = _f.replace(/.\//g, '').replace(/.vue/g, '') || '暂无';
            Vue.component(_req(_f).default.name || _name, _req(_f).default);
        });

        // md文档引入 将md文件注册为全局组件（vue-domtd-laoder会将md自动转成vue）
        const _md = require.context('~/docs/md', true, /\.md$/);
        _md.keys().forEach(_f => {
            const _name = _f.split('/').reverse()[0].replace(/\.md/g, '') || '暂无';
            Vue.component(`md-${_name}`, _md(_f).default);
        });
    }
};
