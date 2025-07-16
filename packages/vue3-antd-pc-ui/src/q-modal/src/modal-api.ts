import { isFunction, js_bind_methods } from '@quantum-design/utils';
import type { ModalApiOptions, ModalState } from './types/modal';
import { defineStore, type StoreDefinition } from 'pinia';

export class ModalApi {
    // 共享数据
    public sharedData: Record<'payload', any> = {
        payload: {}
    };
    public store: ReturnType<StoreDefinition>;

    private api: Pick<
    ModalApiOptions,
    | 'onBeforeClose'
    | 'onCancel'
    | 'onConfirm'
    | 'onOpenChange'
  >;

    // private prevState!: ModalState;
    private state!: ModalState;
    id!: string;

    constructor(options: ModalApiOptions = {}) {
        const {
            connectedComponent: _,
            onBeforeClose,
            onCancel,
            onConfirm,
            onOpenChange,
            id,
            ...storeState
        } = options;
        this.id = id as string;

        const defaultState: ModalState = {
            closeOnPressEscape: true,
            bordered: true,
            centered: false,
            class: '',
            maskClosable: true,
            confirmDisabled: false,
            confirmLoading: false,
            contentClass: '',
            draggable: false,
            footer: true,
            footerClass: '',
            fullscreen: false,
            fullscreenButton: true,
            header: true,
            headerClass: '',
            isOpen: false,
            loading: false,
            mask: true,
            showCancelButton: true,
            showConfirmButton: true,
            title: '',
            destroyOnClose: false
        };

        const _this = this;

        const store = defineStore(`q-antd-modal-${id}`, {
            state: (): ModalState => ({
                ...defaultState,
                ...storeState
            }),
            getters: {
                getState: (state: ModalState) => state
            },
            actions: {
                setState(state: ModalState) {
                    this.$patch(state);
                },
                onUpdate(){
                    const state = this.getState;
                    if (state?.isOpen === _this.state?.isOpen) {
                        _this.state = state;
                    } else {
                        _this.state = state;
                        _this.api.onOpenChange?.(!!state?.isOpen);
                    }
                },
                dispose() {
                    this.$dispose();
                }
            }
        });

        this.store = store();

        this.state = this.store.getState; // 记录历史状态

        this.api = {
            onBeforeClose,
            onCancel,
            onConfirm,
            onOpenChange
        };
        js_bind_methods(this);
    }

    /**
   * 关闭弹窗
   * @description 关闭弹窗时会调用 onBeforeClose 钩子函数，如果 onBeforeClose 返回 false，则不关闭弹窗
   */
    async close() {
    // 通过 onBeforeClose 钩子函数来判断是否允许关闭弹窗
    // 如果 onBeforeClose 返回 false，则不关闭弹窗
        const allowClose = (await this.api.onBeforeClose?.()) ?? true;
        if (allowClose) {
            this.store.setState({
                isOpen: false,
                submitting: false
            });
        }
    }

    getData<T extends object = Record<string, any>>() {
        return (this.sharedData?.payload ?? {}) as T;
    }

    /**
   * 锁定弹窗状态（用于提交过程中的等待状态）
   * @description 锁定状态将禁用默认的取消按钮，使用spinner覆盖弹窗内容，隐藏关闭按钮，阻止手动关闭弹窗，将默认的提交按钮标记为loading状态
   * @param isLocked 是否锁定
   */
    lock(isLocked = true) {
        return this.setState({ submitting: isLocked });
    }

    /**
   * 取消操作
   */
    onCancel() {
        if (this.api.onCancel) {
            this.api.onCancel?.();
        } else {
            this.close();
        }
    }

    /**
   * 确认操作
   */
    onConfirm() {
        this.api.onConfirm?.();
    }

    open() {
        this.store.setState({ isOpen: true });
    }

    setData<T>(payload: T) {
        this.sharedData.payload = payload;
        return this;
    }

    setState(
        state: Partial<ModalState>
    ) {
        this.store.setState({ ...state });
        return this;
    }

    /**
   * 解除弹窗的锁定状态
   * @description 解除由lock方法设置的锁定状态，是lock(false)的别名
   */
    unlock() {
        return this.lock(false);
    }
}
