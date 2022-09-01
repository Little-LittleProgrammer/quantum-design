import { createApp } from 'vue';
import {setup_store} from '@/store';
import { router, setup_router, _routerData } from '@/router';
import setting from '@/enums/projectEnum';
import { register_glob_comp } from './antd';
import { update_theme } from './assets/ts/theme';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { MemorialEnum } from '@qmfront/shared/enums';
import { createLocalStorage } from '@qmfront/shared/utils';
import { setup_outer_guard } from './router/setup-router';
import { useGlobalStore } from './store/modules/global';
import App from './App.vue';

// 时间组件中文
dayjs.locale('cn');

const app = createApp(App);

// 安装store
setup_store(app);
// 安装router
setup_router(app);

// router-guard 安装路由守卫
setup_outer_guard(router, _routerData);

// 安装 antd
register_glob_comp(app);

// 主题
const ls = createLocalStorage();

let _themeMode = ls.get('themeMode');

if (setting.theme.grayMode) {
    const globalStore = useGlobalStore();
    const _timeNow = globalStore.date;
    console.log('_timeNow', _timeNow);
    type Enum = keyof typeof MemorialEnum
    for (const key in MemorialEnum) {
        if (dayjs(_timeNow).format('MM-DD') == MemorialEnum[key as Enum]) {
            _themeMode = 'gray-mode';
        }
    }
}
update_theme(_themeMode);// 更新主题为local中保存的主题

app.mount('#app');
