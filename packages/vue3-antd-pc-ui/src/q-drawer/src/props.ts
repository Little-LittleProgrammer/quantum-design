import type { PropType } from 'vue';

export const footerProps = {
    confirmLoading: { type: Boolean },
    /**
   * @description: Show close button
   */
    showCancelBtn: { type: Boolean, default: true },
    cancelButtonProps: Object as PropType<Record<string, any>>,
    cancelText: { type: String, default: '取消' },
    /**
   * @description: Show confirmation button
   */
    showOkBtn: { type: Boolean, default: true },
    okButtonProps: Object as PropType<Record<string, any>>,
    okText: { type: String, default: '提交' },
    okType: { type: String, default: 'primary' },
    showFooter: { type: Boolean, default: true },
    footerHeight: {
        type: [String, Number] as PropType<string | number>,
        default: 60
    }
};
export const basicProps = {
    isDetail: { type: Boolean },
    title: { type: String, default: '' },
    loadingText: { type: String },
    showDetailBack: { type: Boolean, default: true },
    visible: { type: Boolean },
    loading: { type: Boolean },
    maskClosable: { type: Boolean, default: true },
    getContainer: {
        type: [Object, String] as PropType<any>
    },
    closeFunc: {
        type: [Function, Object] as PropType<any>,
        default: null
    },
    destroyOnClose: { type: Boolean, default: true },
    ...footerProps
};
