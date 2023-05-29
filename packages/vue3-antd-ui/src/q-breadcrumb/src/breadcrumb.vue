<!--  -->
<template>
    <div class="breadcrumb-container">
        <transition-group name="breadcrumb">
            <span class="breadcrumb-item" v-for="(item, index) in data.breadcrumbList" :key="item.id">
                <span class="breadcrumb-link" @click="jump_page(item, index)">{{item.title}}</span>
                <span class="breadcrumb-separator">/</span>
            </span>
        </transition-group>
    </div>
</template>

<script lang='ts' setup>
import { reactive, watch, getCurrentInstance} from 'vue';
import { LocationQuery, Router } from 'vue-router';
import { IBreadcrumb } from '../../utils/types';
import { breadcrumbProps } from './types';
import { flatten } from './utils';
import './style/index.scss';

interface IQueryCache {
    id: number,
    path: string,
    query: LocationQuery
}
interface DataProps {
    breadcrumbList: IBreadcrumb[]
}

const props = defineProps(breadcrumbProps);
const instance = getCurrentInstance()!;

const queryCache: Record<string, IQueryCache> = {};
const formatObj: Record<string, IBreadcrumb> = flatten(props.routerList);
let parentList: IBreadcrumb[] = [];
let index = 0;
const router = instance.appContext.config.globalProperties.$router as Router;
const route = router.currentRoute;
const data: DataProps = reactive({
    breadcrumbList: []
});
const jump_page = (item: IBreadcrumb, index: number) => {
    if (index !== data.breadcrumbList.length - 1) {
        const query = queryCache[item.path.split('/')[item.path.split('/').length - 1]]?.query;
        router.push({
            name: item.name,
            query
        });
    }
};
const find_family = (obj: Record<string, IBreadcrumb>, pid: string) => {
    if (pid != '0') {
        const _cacheObj = obj[pid];
        parentList.push(_cacheObj);
        find_family(obj, _cacheObj.pid);
    }
};
// 生成正确的顺序
const create_breadcrumb_list = () => {
    const _route = route.value;
    let _cacheObj: IBreadcrumb = {
        id: '',
        name: '',
        path: '',
        pid: '',
        title: ''
    };
    if (Object.keys(_route.query).length !== 0) {
        const _fin = _route.path.split('/')[_route.path.split('/').length - 1];
        // 缓存query, {'opening-ad': {id:1,path: 'opening-ad', query: 't:10021232'}}
        queryCache[_fin] = {
            id: index++,
            path: _fin,
            query: _route.query
        };
        // this.delete_wheel(this.queryCache);
    }
    if (Object.keys(queryCache).length > 10) {
        // 保证 queryCache 里只有10个子节点, 根据id判断, id最小的节点删除
        const _arr = Object.values(queryCache);
        _arr.sort((a, b) => a.id - b.id);
        delete queryCache[_arr[0].path];
    }
    _cacheObj = formatObj[_route.meta.id];
    if (Object.keys(_cacheObj).length > 0) {
        parentList = [];
        find_family(formatObj, _cacheObj.pid);
        data.breadcrumbList = [
            _cacheObj,
            ...parentList
        ].reverse();
    }
};
watch(route, (val) => {
    if (val) {
        if (val.name != 'Redirect') {
            create_breadcrumb_list();
        }
    }
}, { immediate: true });
</script>
