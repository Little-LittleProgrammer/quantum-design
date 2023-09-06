import { Modal, message as Message } from 'ant-design-vue';
import type { ModalFunc, ModalFuncProps } from 'ant-design-vue/lib/modal/Modal';
import { InfoCircleFilled, CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons-vue';
import { js_is_string } from '@q-front-npm/utils';
import { h } from 'vue';
import { VueNode } from 'ant-design-vue/lib/_util/type';

export type NotificationPlacement = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
export type IconType = 'success' | 'info' | 'error' | 'warning' | 'close';

export interface ModalOptionsEx extends Omit<ModalFuncProps, 'iconType'> {
    iconType?: 'warning' | 'success' | 'error' | 'info';
}

interface ConfirmOptions {
    info: ModalFunc;
    success: ModalFunc;
    error: ModalFunc;
    warn: ModalFunc;
    warning: ModalFunc;
}

/**
 * @description: Create confirmation box
 */
function createConfirm(options: ModalOptionsEx): ConfirmOptions {
    const iconType = options.iconType || 'warning';
    Reflect.deleteProperty(options, 'iconType');
    const opt: ModalFuncProps = {
        centered: true,
        wrapClassName: 'g-create-confirm',
        icon: getIcon(iconType) as unknown as (() => VueNode) | undefined,
        okText: '确认' as unknown as (() => VueNode) | undefined,
        cancelText: '取消' as unknown as (() => VueNode) | undefined,
        ...options,
        content: renderContent(options) as (() => VueNode) | undefined

    };
    return Modal.confirm(opt) as unknown as ConfirmOptions;
}

export type ModalOptionsPartial = Partial<ModalOptionsEx> & Pick<ModalOptionsEx, 'content'>;

function getIcon(iconType: string) {
    if (iconType === 'warning') {
        return h(InfoCircleFilled, {class: 'modal-icon-warning'});
    } else if (iconType === 'success') {
        return h(CheckCircleFilled, {class: 'modal-icon-success'});
    } else if (iconType === 'info') {
        return h(InfoCircleFilled, {class: 'modal-icon-info'});
    } else {
        return h(CloseCircleFilled, {class: 'modal-icon-error'});
    }
}

function renderContent({ content }: Pick<ModalOptionsEx, 'content'>) {
    if (js_is_string(content)) {
        return h('div', {innerHTML: `<div>${content as string}</div>`});
    } else {
        return content;
    }
}

function createModalOptions(options: ModalOptionsPartial, icon: IconType): ModalOptionsPartial{
    return {
        okText: () => h('span', '确定'),
        centered: true,
        ...options,
        content: renderContent(options) as (() => VueNode) | undefined,
        icon: getIcon(icon) as unknown as (() => VueNode) | undefined
    };
}

function createSuccessModal(options: ModalOptionsPartial) {
    return Modal.success(createModalOptions(options, 'success'));
}

function createErrorModal(options: ModalOptionsPartial) {
    return Modal.error(createModalOptions(options, 'close'));
}

function createInfoModal(options: ModalOptionsPartial) {
    return Modal.info(createModalOptions(options, 'info'));
}

function createWarningModal(options: ModalOptionsPartial) {
    return Modal.warning(createModalOptions(options, 'warning'));
}

/**
 * @description: message
 */
export function useMessage() {
    return {
        createMessage: Message,
        createConfirm: createConfirm,
        createSuccessModal,
        createErrorModal,
        createInfoModal,
        createWarningModal
    };
}
