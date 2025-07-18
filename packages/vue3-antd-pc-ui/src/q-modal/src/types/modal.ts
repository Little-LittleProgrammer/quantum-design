import type { Component, Ref } from 'vue';

import type { ModalApi } from '../modal-api';
import type { StoreDefinition } from 'pinia';

export interface ModalProps {
  /**
   * 是否要挂载到内容区域
   * @default false
   */
  appendToMain?: boolean;
  /**
   * 是否显示边框
   * @default false
   */
  bordered?: boolean;
  /**
   * 取消按钮文字
   */
  cancelText?: string;
  /**
   * 是否居中
   * @default false
   */
  centered?: boolean;

  class?: string;

  /**
   * 是否显示右上角的关闭按钮
   * @default true
   */
  closable?: boolean;
  /**
   * 点击弹窗遮罩是否关闭弹窗
   * @default true
   */
  maskClosable?: boolean;
  /**
   * 禁用确认按钮
   */
  confirmDisabled?: boolean;
  /**
   * 确定按钮 loading
   * @default false
   */
  confirmLoading?: boolean;
  /**
   * 确定按钮文字
   */
  okText?: string;
  contentClass?: string;
  /**
   * 弹窗描述
   */
  description?: string;
  /**
   * 是否可拖拽
   * @default false
   */
  draggable?: boolean;
  /**
   * 是否显示底部
   * @default true
   */
  footer?: boolean;
  footerClass?: string;
  /**
   * 是否全屏
   * @default false
   */
  fullscreen?: boolean;
  /**
   * 是否显示全屏按钮
   * @default true
   */
  fullscreenButton?: boolean;
  /**
   * 是否显示顶栏
   * @default true
   */
  header?: boolean;
  headerClass?: string;
  /**
   * 弹窗是否显示
   * @default false
   */
  loading?: boolean;
  /**
   * 是否显示遮罩
   * @default true
   */
  mask?: boolean;
  /**
   * 是否显示取消按钮
   * @default true
   */
  showCancelButton?: boolean;
  /**
   * 是否显示确认按钮
   * @default true
   */
  showConfirmButton?: boolean;
  /**
   * 提交中（锁定弹窗状态）
   */
  submitting?: boolean;
  /**
   * 弹窗标题
   */
  title?: string;
  /**
   * 弹窗标题提示
   */
  titleTooltip?: string;
  /**
   * 弹窗层级
   */
  zIndex?: number;
  /**
   * 是否支持按下 ESC 关闭弹窗
   * @default true
   */
  closeOnPressEscape?: boolean;
  /**
   * 是否在关闭时销毁弹窗
   * @default false
   */
  destroyOnClose?: boolean;
}

export interface ModalState extends ModalProps {
  /** 弹窗打开状态 */
  isOpen?: boolean;
  /**
   * 共享数据
   */
  sharedData?: Record<string, any>;
}

export type ExtendedModalApi = ModalApi & {
  useStore: StoreDefinition;
};

export interface ModalApiOptions extends ModalState {
    id?:string;
  /**
   * 独立的弹窗组件
   */
  connectedComponent?: Component;
  /**
   * 在关闭时销毁弹窗。仅在使用 connectedComponent 时有效
   */
  destroyOnClose?: boolean;
  /**
   * 关闭前的回调，返回 false 可以阻止关闭
   * @returns
   */
  onBeforeClose?: () => MaybePromise<boolean | undefined>;
  /**
   * 点击取消按钮的回调
   */
  onCancel?: () => void;
  /**
   * 弹窗关闭动画结束的回调
   * @returns
   */
  onClosed?: () => void;
  /**
   * 点击确定按钮的回调
   */
  onConfirm?: () => void;
  /**
   * 弹窗状态变化回调
   * @param isOpen
   * @returns
   */
  onOpenChange?: (isOpen: boolean) => void;
}
