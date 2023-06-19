import { IProjectConfig } from '@q-front-npm/vue3-antd-pc-ui';

const setting: IProjectConfig = {
    // 主题配置
    theme: {
        // 是否展示主题切换按钮
        showDarkModeToggle: true,
        // 是否开启网站灰色模式，悼念的日期开启(4.4, 4.5, 12.13)
        grayMode: false
    },
    // 功能配置
    func: {
        // 是否展示菜单搜索按钮
        showSearchButton: true,
        // 是否开启回到顶部
        showBackTop: true,
        // 显示面包屑
        showBreadCrumb: false,
        // 左侧菜单栏是否可重复点击
        asideRepeatClick: false,
        // 切换界面的时候是否取消已经发送但是未响应的http请求, openKeepAlive为true是失效
        removeAllHttpPending: true,
        // 是否显示刷新按钮
        showReloadButton: true
    },
    cacheTabsSetting: {
        // 是否展示
        show: true,
        // 是否开启KeepAlive缓存
        openKeepAlive: false,
        // 是否展示快速操作
        showQuick: true,
        // 是否可以拖拽
        canDrag: true,
        // 刷新后是否保留已经打开的标签页
        cache: false
    },
    // 动画配置
    transition: {
        // 是否开启页面切换动画
        enable: true,
        // 是否打开页面切换loading
        openPageLoading: true,
        // 是否打开页面切换顶部进度条
        openNProgress: true
    }

};

export default setting;
