import type { ButtonProps } from 'ant-design-vue';
import type { ComputedRef, CSSProperties } from 'vue';

export interface DrawerInstance {
    setDrawerProps: (props: Partial<DrawerProps>) => void;
    emitVisible?: (visible: boolean, uid: number) => void;
    events?: Record<'onClose', Fn>
}

export interface ReturnMethods extends DrawerInstance {
    openDrawer: <T = any>(visible?: boolean, data?: T, openOnSet?: boolean) => void;
    closeDrawer: () => void;
    getVisible?: ComputedRef<boolean>;
}

export type RegisterFnDrawer = (drawerInstance: DrawerInstance, uuid: string) => void;

export interface ReturnInnerMethods extends DrawerInstance {
    closeDrawer: () => void;
    changeLoading: (loading: boolean) => void;
    changeOkLoading: (loading: boolean) => void;
    getVisible?: ComputedRef<boolean>;
}

export type UseDrawerReturnType = [RegisterFnDrawer, ReturnMethods];

export type UseDrawerInnerReturnType = [RegisterFnDrawer, ReturnInnerMethods];

export interface DrawerFooterProps {
    showOkBtn: boolean;
    showCancelBtn: boolean;
    /**
     * Text of the Cancel button
     * @default 'cancel'
     * @type string
     */
    cancelText: string;
    /**
     * Text of the OK button
     * @default 'OK'
     * @type string
     */
    okText: string;

    /**
     * Button type of the OK button
     * @default 'primary'
     * @type string
     */
    okType: 'primary' | 'danger' | 'dashed' | 'ghost' | 'default';
    /**
     * The ok button props, follow jsx rules
     * @type object
     */
    okButtonProps: { props: ButtonProps; on: {} };

    /**
     * The cancel button props, follow jsx rules
     * @type object
     */
    cancelButtonProps: { props: ButtonProps; on: {} };
    /**
     * Whether to apply loading visual effect for OK button or not
     * @default false
     * @type boolean
     */
    confirmLoading: boolean;

    showFooter: boolean;
    footerHeight: string | number;
}

export interface DrawerProps extends DrawerFooterProps {
    isDetail?: boolean;
    loading?: boolean;
    showDetailBack?: boolean;
    visible?: boolean;
    /**
     * Built-in ScrollContainer component configuration
     * @type ScrollContainerOptions
     */
    scrollOptions?: {
        enableScroll?: boolean;
        type?: 'default' | 'main';
    };
    closeFunc?: () => Promise<any>;
    triggerWindowResize?: boolean;
    /**
     * Whether a close (x) button is visible on top right of the Drawer dialog or not.
     * @default true
     * @type boolean
     */
    closable?: boolean;

    /**
     * Whether to unmount child components on closing drawer or not.
     * @default false
     * @type boolean
     */
    destroyOnClose?: boolean;

    /**
     * Return the mounted node for Drawer.
     * @default 'body'
     * @type ( HTMLElement| () => HTMLElement | string)
     */
    getContainer?: HTMLElement |(() => HTMLElement) | string;
    /**
     * Whether to show mask or not.
     * @default true
     * @type boolean
     */
    mask?: boolean;

    /**
     * Clicking on the mask (area outside the Drawer) to close the Drawer or not.
     * @default true
     * @type boolean
     */
    maskClosable?: boolean;

    /**
     * Style for Drawer's mask element.
     * @default {}
     * @type object
     */
    maskStyle?: CSSProperties;

    /**
     * The title for Drawer.
     * @type any (string | slot)
     */
    title?: string ;
    /**
     * The class name of the container of the Drawer dialog.
     * @type string
     */
    wrapClassName?: string;
    class?: string;
    /**
     * Style of wrapper element which **contains mask** compare to `drawerStyle`
     * @type object
     */
    wrapStyle?: CSSProperties;

    /**
     * Style of the popup layer element
     * @type object
     */
    drawerStyle?: CSSProperties;

    /**
     * Style of floating layer, typically used for adjusting its position.
     * @type object
     */
    bodyStyle?: CSSProperties;
    headerStyle?: CSSProperties;

    /**
     * Width of the Drawer dialog.
     * @default 256
     * @type string | number
     */
    width?: string | number;

    /**
     * placement is top or bottom, height of the Drawer dialog.
     * @type string | number
     */
    height?: string | number;

    /**
     * The z-index of the Drawer.
     * @default 1000
     * @type number
     */
    zIndex?: number;

    /**
     * The placement of the Drawer.
     * @default 'right'
     * @type string
     */
    placement?: 'top' | 'right' | 'bottom' | 'left';
    afterVisibleChange?: (visible?: boolean) => void;
    keyboard?: boolean;
    /**
     * Specify a callback that will be called when a user clicks mask, close button or Cancel button.
     */
    onClose?: (e?: Event) => void;
}

export interface DrawerActionType {
    scrollBottom: () => void;
    scrollTo: (to: number) => void;
    getScrollWrap: () => Element | null;
}

