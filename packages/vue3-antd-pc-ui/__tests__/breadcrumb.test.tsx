import {QBreadcrumb} from '../src/q-breadcrumb';
import { mount } from '@vue/test-utils';
import { nextTick, ref } from 'vue';
import {expect, test, vi, describe} from 'vitest';
import { createRouter, createWebHistory } from 'vue-router';
describe('q-breadcrumb', () => {
    const _routeList = [
        {
            path: '/backend/system-management',
            name: 'SystemManagement',
            component: () => new Promise((resolve) => { resolve('parent'); }),
            meta: {
                title: '系统管理',
                pid: '0',
                id: 'system-management'
            },
            redirect: '/backend/system-management/permission',
            children: [
                {
                    path: 'permission',
                    name: 'Permission',
                    component: () => new Promise((resolve) => { resolve('parent'); }),
                    // component: () => import('@/views/system-management/permission/index.vue'),
                    meta: {
                        title: '权限管理',
                        pid: 'system-management',
                        id: 'permission'
                    },
                    redirect: '/backend/system-management/permission/menu-config',
                    children: [
                        {
                            path: 'menu-config',
                            name: 'MenuConfig',
                            component: () => new Promise((resolve) => { resolve('parent'); }),
                            meta: {
                                title: '菜单配置',
                                pid: 'permission',
                                id: 'menu-config'
                            }
                        },
                        {
                            path: 'role',
                            name: 'Role',
                            component: () => new Promise((resolve) => { resolve('parent'); }),
                            meta: {
                                title: '角色管理',
                                pid: 'permission',
                                id: 'role'
                            }
                        },
                        {
                            path: 'person',
                            name: 'Person',
                            component: () => new Promise((resolve) => { resolve('parent'); }),
                            meta: {
                                title: '人员管理',
                                pid: 'permission',
                                id: 'person'
                            }
                        }
                    ]
                }
            ]
        }
    ];
    const _router = createRouter({
        history: createWebHistory(),
        routes: _routeList
    });
    test('breadcrumb success', async() => {
        _router.push('/backend/system-management/permission/menu-config');
        await _router.isReady();
        const _wrapper = mount(() => (
            <div>
                <routerView></routerView>
                <QBreadcrumb routerList={_routeList}></QBreadcrumb>
            </div>
        ), {global: {plugins: [_router]}});
        await nextTick();
        const _breadcrumbWapper = _wrapper.findAll('.breadcrumb-link');
        expect(_breadcrumbWapper[_breadcrumbWapper.length - 1].text()).toBe('菜单配置');
    });
});
