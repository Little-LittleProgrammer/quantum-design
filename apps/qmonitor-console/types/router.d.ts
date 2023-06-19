import 'vue-router';

// 强制规定 routeMet 的属性
declare module 'vue-router' {
    export interface RouteMeta {
        pid: string,
        id: string,
        title: string,
        pathName?: string
    }
}
