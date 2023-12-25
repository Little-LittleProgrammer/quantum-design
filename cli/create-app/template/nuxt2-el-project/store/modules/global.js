import { MessageBox, Loading } from 'element-ui';

const state = () => {
    return {
        systemName: '七猫项目', // 项目名
        date: '', //  服务器时间（记录接口返回的时间，不是服务器实时时间）
        dataLoading: false, //  数据加载
        pageLoadingObj: '', // loading对象
        environmentData: { //  环境
            env: '', // 0:测试环境 1:正式环境
            title: ''
        },
        asyncExportNoticePop: { //  下载
            visible: false,
            file: '', //  文件名
            title: '' //  异步查看文件的列表html代码（包含查看链接）
        },
        authorityMannage: true, // 权限管理开关（默认为开启，需要配置相应的数据）
        hasHistoryUrl: false, // 是否有项目历史地址
        metaTitle: '' // 设置meta title
    };
};

const getters = {
};

const mutations = {
    SET_DATA_LOADING_STATUS(state, data) { //  设置数据loading
        state.dataLoading = data;
    },
    SET_PAGE_LOADING_STATUS(state, data) { //  设置页面loading
        if (data){
            state.pageLoadingObj = Loading.service({
                fullscreen: true
            });
        } else {
            state.pageLoadingObj.close();
        }
    },
    SET_DATE(state, data){ //  设置服务器时间
        state.date = new Date(data);
    },
    SET_HISTORY_URL(state, data){ //  设置项目历史地址状态
        state.hasHistoryUrl = data;
    },
    SET_ENVIRONMENT_DATA(state, data){ //  环境检测
        if (state.environmentData.env != '' && parseInt(data.env) != parseInt(state.environmentData.env)){
            window.location.reload();
            return false;
        }
        state.environmentData.env = '' + data.env;
        if (data.env == '0'){
            state.environmentData.title = '测试环境';
        } else if (data.env == '1'){
            state.environmentData.title = '正式环境';
        }
    },
    SET_ASYNC_EXPORT_DATA(state, data) { //  设置导出功能数据
        if (data.action == 'async') {
            if (data.title) {
                state.asyncExportNoticePop.title = data.title;
            }
            state.asyncExportNoticePop.file = data.message;
            state.asyncExportNoticePop.visible = true;
        } else if (data.action == 'sync') {
            window.open(data.url, '_blank');
            MessageBox.success({
                title: '导出成功',
                type: 'success'
            });
        }
    },
    SET_ASYNC_POP_STATUS(state, data){ //  设置导出弹框关闭
        state.asyncExportNoticePop.visible = data;
    },
    SET_META_TITLE(state, data){ //  设置title
        state.metaTitle = data;
    }
};

const actions = {
};

export default {
    state,
    getters,
    actions,
    mutations
};
