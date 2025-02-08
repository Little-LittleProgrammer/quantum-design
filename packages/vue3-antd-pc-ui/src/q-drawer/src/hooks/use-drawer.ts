import { isFunction } from '@quantum-design/utils';
import { isEqual } from 'lodash-es';
import { computed, getCurrentInstance, nextTick, onUnmounted, reactive, ref, toRaw, unref, watchEffect } from 'vue';
import type { DrawerInstance, DrawerProps, ReturnMethods, UseDrawerInnerReturnType, UseDrawerReturnType } from '../type';

const dataTransferRef = reactive<any>({});

const visibleData = reactive<{ [key: number]: boolean }>({});
// @ts-ignore
const isProdMode = import.meta.env.PROD;

/**
 * @description: Applicable to separate drawer and call outside
 */
export function useDrawer():UseDrawerReturnType {
    if (!getCurrentInstance()) {
        throw new Error('useDrawer can only bu used inside setup or functional components');
    }
    const drawer = ref<DrawerInstance | null>(null);
    const loading = ref<Nullable<boolean>>(false);
    const uid = ref<string>('');

    // 注册组件
    function register(drawerInstance: DrawerInstance, uuid: string) {
        isProdMode &&
        onUnmounted(() => {
            drawer.value = null;
            loading.value = null;
            dataTransferRef[unref(uid)] = null;
        });

        if (unref(loading) && isProdMode && drawerInstance === unref(drawer)) {
            return;
        }
        uid.value = uuid;
        drawer.value = drawerInstance;
        loading.value = true;
        drawerInstance.emitVisible = (visible: boolean, uid: number) => {
            visibleData[uid] = visible;
        };
    }

    // 获取实例
    const getInstance = () => {
        const instance = unref(drawer);
        if (!instance) {
            console.error('useDrawer instance is undefined!');
        }
        return instance;
    };

    // export method
    const methods: ReturnMethods = {
        setDrawerProps: (props: Partial<DrawerProps>): void => {
            getInstance()?.setDrawerProps(props);
        },

        getVisible: computed((): boolean => {
            // ~按位取反操作符
            return visibleData[~~unref(uid)];
        }),

        openDrawer: <T = any>(visible = true, data?: T, openOnSet = true): void => {
            getInstance()?.setDrawerProps({
                visible: visible
            });
            if (!data) return;

            if (openOnSet) {
                dataTransferRef[unref(uid)] = null;
                dataTransferRef[unref(uid)] = toRaw(data);
                return;
            }
            const equal = isEqual(toRaw(dataTransferRef[unref(uid)]), toRaw(data));
            if (!equal) {
                dataTransferRef[unref(uid)] = toRaw(data);
            }
        },
        closeDrawer: () => {
            getInstance()?.events?.onClose();
        }
    };
    return [register, methods];
}

/**
 * @description: Applicable to inside a stand-alone Drawer
 */
export const useDrawerInner = (callbackFn?: Fn): UseDrawerInnerReturnType => {
    const drawerInstanceRef = ref<Nullable<DrawerInstance>>(null);
    const currentInstance = getCurrentInstance();
    const uidRef = ref<string>('');

    if (!getCurrentInstance()) {
        throw new Error('useDrawerInner() can only be used inside setup() or functional components!');
    }

    const getInstance = () => {
        const instance = unref(drawerInstanceRef);
        if (!instance) {
            console.error('useDrawerInner instance is undefined!');
            return;
        }
        return instance;
    };

    const register = (modalInstance: DrawerInstance, uuid: string) => {
        isProdMode &&
        onUnmounted(() => {
            drawerInstanceRef.value = null;
        });

        uidRef.value = uuid;
        drawerInstanceRef.value = modalInstance;
        currentInstance?.emit('register', modalInstance, uuid);
    };

    watchEffect(() => {
        const data = dataTransferRef[unref(uidRef)];
        if (!data) return;
        if (!callbackFn || !isFunction(callbackFn)) return;
        nextTick(() => {
            callbackFn(data);
        });
    });

    return [
        register,
        {
            changeLoading: (loading = true) => {
                getInstance()?.setDrawerProps({ loading });
            },

            changeOkLoading: (loading = true) => {
                getInstance()?.setDrawerProps({ confirmLoading: loading });
            },
            getVisible: computed((): boolean => {
                return visibleData[~~unref(uidRef)];
            }),

            closeDrawer: () => {
                getInstance()?.events?.onClose();
            },

            setDrawerProps: (props: Partial<DrawerProps>) => {
                getInstance()?.setDrawerProps(props);
            }
        }
    ];
};

