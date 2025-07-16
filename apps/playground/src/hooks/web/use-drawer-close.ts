import { isArray } from '@quantum-design/utils';
import { type ComputedRef, onDeactivated, onUnmounted } from 'vue';

interface IConfig {
    getVisible?: ComputedRef<boolean>;
    closeDrawer: () => void
}

export function useDrawerClose(config: IConfig | IConfig[]) {
    function close() {
        if (isArray(config)) {
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
