import { useGlobalStore } from '@/store/modules/global';
import { computed } from 'vue';

// 写成hooks, 方便以后扩展, 扩展项目可视化配置
export function useThemeSetting() {
    const globalStore = useGlobalStore();
    const getThemeMode = computed(() => globalStore.getThemeMode);

    function setThemeMode(theme: 'dark' | 'light') {
        globalStore.set_theme_mode(theme);
    }
    return {
        setThemeMode,
        getThemeMode
    };
}
