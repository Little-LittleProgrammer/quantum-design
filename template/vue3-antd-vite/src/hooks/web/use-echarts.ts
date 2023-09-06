import { useEcharts as globalUseEcharts } from '@q-front-npm/hooks/vue';
import { Ref } from 'vue';
import { useThemeSetting } from '../settings/use-theme-setting';

export function useEcharts(
    elRef: Ref<HTMLDivElement>,
    theme: 'light' | 'dark' | 'default' = 'default'
) {
    const {getThemeMode} = useThemeSetting();
    const instance = globalUseEcharts(elRef, theme, getThemeMode);
    return {...instance};
}
