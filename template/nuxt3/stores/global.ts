
export interface IFileExport {
    title?: string;
    action: string;
    message: string;
    export_url: string
}

// let timeId: TimeoutHandle;

// const ls = createLocalStorage();

// state
const createState = () => {
    const state = {
        systemName: '七猫广告',
        // theme: ls.get('themeMode') || 'light' as 'light' | 'dark',
        date: new Date(),
        dataLoading: false,
        pageLoading: false,
        environmentData: { //  环境
            env: '', // 0:测试环境 1:正式环境
            title: ''
        },
        asyncExportNoticePop: { //  下载
            visible: false,
            file: '', //  文件名
            title: '' //  异步查看文件的列表html代码（包含查看链接）
        },
        hasHistoryUrl: false, // 是否有项目历史地址
        authorityManage: true, // 权限管理开关（默认为开启，需要配置相应的数据）
        citySelect: [] as ISelectOption[],
        ip: ''
    };
    return state;
};
export type globalState = ReturnType<typeof createState>

export const state = createState();

export const useGlobalStore = defineStore('global', {
    state: ():globalState => (state),
    getters: {
        // getThemeMode(state): 'light' | 'dark' {
        //     return state.theme || ls.get('themeMode') || 'light';
        // }
    },
    actions: {
        // set_theme_mode(mode: 'light' | 'dark') {
        //     this.theme = mode;
        //     ls.set('themeMode', mode);
        //     update_theme(mode);
        // },
        set_environment_data(data: SelectPartial<globalState['environmentData'], 'env'>) {
            if (this.environmentData.env != '' && parseInt(data.env) != parseInt(this.environmentData.env)){
                window.location.reload();
                return false;
            }
            this.environmentData.env = '' + data.env;
            if (data.env == '0'){
                this.environmentData.title = '测试环境';
            } else if (data.env == '1'){
                this.environmentData.title = '正式环境';
            }
        },
        // set_async_export_data(data:IFileExport) {
        //     if (data.action === 'async') {
        //         if (data.title) {
        //             this.asyncExportNoticePop.title = data.title;
        //         }
        //         this.asyncExportNoticePop.file = data.message;
        //         this.asyncExportNoticePop.visible = true;
        //     } else if (data.action === 'sync') {
        //         window.open(data.export_url, '_blank');
        //         message.success('导出成功');
        //     }
        // },
        // set_page_loading_action(loading:boolean) {
        //     if (loading) {
        //         clearTimeout(timeId);
        //         // Prevent flicker
        //         timeId = setTimeout(() => {
        //             this.pageLoading = loading;
        //         }, 50);
        //     } else {
        //         this.pageLoading = loading;
        //         clearTimeout(timeId);
        //     }
        // }
    }
});

