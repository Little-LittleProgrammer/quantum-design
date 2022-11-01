import { menuData } from '#/router';

const _menus:menuData[] = [{
    auth_name: '运营',
    id: 'operation-module',
    pid: '0',
    path: '/backend/operation-module',
    children: [{
        auth_name: '切量',
        id: 'canary-management',
        pid: 'operation-module',
        path: '/backend/operation-module/canary-management'
    }, {
        auth_name: '流量配置',
        id: 'flow-management',
        pid: 'operation-module',
        path: '/backend/operation-module/flow-management'
    }, {
        auth_name: '广告位策略',
        id: 'policy-management',
        pid: 'operation-module',
        path: '/backend/operation-module/policy-management'
    }, {
        auth_name: 'AB-Test',
        id: 'abtest-management',
        pid: 'operation-module',
        path: '/backend/operation-module/abtest-management'
    }]
}, {
    auth_name: '媒体资源',
    id: 'media-resource',
    pid: '0',
    path: '/backend/media-resource',
    children: [{
        auth_name: '广告位管理',
        id: 'ad-space-manage',
        pid: 'media-resource',
        path: '/backend/media-resource/ad-space-manage'
    }, {
        auth_name: '创意管理',
        id: 'creative-template',
        pid: 'media-resource',
        path: '/backend/media-resource/creative-template'
    }, {
        auth_name: '媒体管理',
        id: 'media-manage',
        pid: 'media-resource',
        path: '/backend/media-resource/media-manage'
    }]
}, {
    auth_name: '合作渠道',
    id: 'cooperation-module',
    pid: '0',
    path: '/backend/cooperation-module',
    children: [{
        auth_name: '广告位管理',
        id: 'cp-management',
        pid: 'cooperation-module',
        path: '/backend/cooperation-module/cp-management'
    }]
}];

console.log('_menus', _menus);

export default _menus;
