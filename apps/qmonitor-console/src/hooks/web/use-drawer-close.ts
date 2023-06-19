import { js_is_array } from '@q-front-npm/utils';
import { ComputedRef, onDeactivated, onUnmounted } from 'vue';

interface IConfig {
    getVisible?: ComputedRef<boolean>;
    closeDrawer: () => void
}

export function useDrawerClose(config: IConfig | IConfig[]) {
    function close() {
        if (js_is_array(config)) {
            for (const conf of config) {
                const {getVisible, closeDrawer} = conf;
                if (getVisible?.value) {
                    closeDrawer();
                }
            }
        } else {
            const {getVisible, closeDrawer} = config;
            if (getVisible?.value) {
                closeDrawer();
            }
        }
    }

    onDeactivated(() => {
        close();
    });

    onUnmounted(() => {
        close();
    });
}
