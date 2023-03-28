import { useEcharts as globalUseEcharts } from '@wuefront/hooks/vue';
import { Ref } from 'vue';
import { useProjectSetting } from '../settings/use-project-setting';

export function useEcharts(
    elRef: Ref<HTMLDivElement>,
    theme: 'light' | 'dark' | 'default' = 'default'
) {
    const {getThemeMode} = useProjectSetting();
    const instance = globalUseEcharts(elRef, theme, getThemeMode);
    return {...instance};
}
