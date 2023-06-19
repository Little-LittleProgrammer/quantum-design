export interface IProjectConfig {
    theme?: IProjectConfigTheme
    func?:IProjectConfigFunc
    cacheTabsSetting?:IProjectConfigCache
    transition?:IProjectConfigTransition
}

export interface IProjectConfigTheme {
    showDarkModeToggle?: boolean; // 是否展示主题切换按钮
    grayMode?: boolean; // 是否开启网站灰色模式，悼念的日期开启(4.4, 4.5, 12.13)
}
export interface IProjectConfigFunc {
    showSearchButton?: boolean; // 是否展示菜单搜索按钮
    showBackTop?: boolean; // 是否开启回到顶部
    showBreadCrumb?: boolean, // 显示面包屑
    asideRepeatClick?: boolean, // 左侧菜单栏是否可重复点击
    removeAllHttpPending?: boolean, // 切换界面的时候是否取消已经发送但是未响应的http请求, openKeepAlive为true是失效
    showReloadButton?: boolean // 是否显示刷新按钮
}
export interface IProjectConfigCache {
    show?: boolean, // 是否展示
    openKeepAlive?: boolean, // 是否开启KeepAlive缓存
    showQuick?: boolean, // 是否展示快速操作
    canDrag?: boolean, // 是否可以拖拽
    cache?: boolean // 刷新后是否保留已经打开的标签页
}
export interface IProjectConfigTransition {
    enable?: boolean, // 是否开启页面切换动画
    openPageLoading?: boolean, // 是否打开页面切换loading
    openNProgress?: boolean, // 是否打开页面切换顶部进度条
}
