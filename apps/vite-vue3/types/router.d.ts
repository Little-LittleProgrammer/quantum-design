import 'vue-router';

export interface menuData {
    auth_name: string;
    icon?: string;
    id: string;
    path: string;
    pid: string;
    children?: menuData[]
}

// 强制规定 routeMet 的属性
declare module 'vue-router' {
    export interface RouteMeta {
        pid: string,
        id: string,
        title: string,
        pathName?: string
    }
}
