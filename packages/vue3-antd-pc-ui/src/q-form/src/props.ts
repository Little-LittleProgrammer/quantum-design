import type { FieldMapToTime, FormSchema } from './types/form';
import type { CSSProperties, PropType, Ref } from 'vue';
import type { ColEx } from './types';
import type { ButtonProps } from 'ant-design-vue/es/button/buttonTypes';
import type { RowProps } from 'ant-design-vue/lib/grid/Row';
import { propTypes } from '@quantum-design/types/vue/types';
import {gDateFormatEnum} from '@quantum-design/shared/enums';
import type { TableActionType } from '@vue3-antd/q-table/src/types/table';

export const basicProps = {
    // 绑定哪个model, 将 formModel 值绑定
    model: {
        type: Object as PropType<Record<string, any>>,
        default: {}
    },
    // 标签宽度  固定宽度, form-item.vue -》 useLabelWidth 里使用
    labelWidth: {
        type: [Number, String] as PropType<number | string>,
        default: 0
    },
    /**
     * 自定义格式化日期, 权值高于transformDateFunc,这是针对于单个属性设置
     * e.g
     * ```js
     * fieldMapToTime = ['formData', ['startTime', 'endTime'], 'YYYY-MM-DD']
     * ```
     */
    fieldMapToTime: {
        type: Array as PropType<FieldMapToTime>,
        default: () => []
    },
    // 是否采用紧凑模式
    compact: propTypes.bool.def(true),
    // 表单配置规则
    schemas: {
        type: [Array] as unknown as PropType<Ref<FormSchema[]>>,
        default: () => []
    },
    // 额外传递到子组件的参数 values
    mergeDynamicData: {
        type: Object as PropType<Record<string, any>>,
        default: null
    },
    // 基本的行样式,使用方式, 和行内样式一致
    baseRowStyle: {
        type: Object as PropType<CSSProperties>
    },
    // 基本的列样式
    baseColProps: {
        type: Object as PropType<Partial<ColEx>>
    },
    // 自动设置 PlaceHolder, ‘请选择’, ‘请输入’
    autoSetPlaceHolder: propTypes.bool.def(true),
    // 在INPUT组件上单击回车时，是否自动提交
    autoSubmitOnEnter: propTypes.bool.def(false),
    // 提交后重置内容
    submitOnReset: propTypes.bool,
    // form-size
    size: propTypes.oneOf(['default', 'small', 'large']).def('default'),
    // 禁用表单
    disabled: propTypes.bool,
    // 转化时间
    transformDateFunc: {
        type: Function as PropType<(date: any) => string>,
        default: (date: any) => {
            return date?.format?.(gDateFormatEnum.dateTime) ?? date;
        }
    },
    rulesMessageJoinLabel: propTypes.bool.def(true),
    // 是否显示操作按钮
    showActionButtonGroup: propTypes.bool.def(true),
    // 操作列Col配置
    actionColOptions: Object as PropType<Partial<ColEx>>,
    // 显示重置按钮
    showResetButton: propTypes.bool.def(true),
    // 重置按钮配置
    resetButtonOptions: Object as PropType<Partial<ButtonProps>>,

    // 显示确认按钮
    showSubmitButton: propTypes.bool.def(true),
    // 确认按钮配置
    submitButtonOptions: Object as PropType<Partial<ButtonProps>>,

    // 自定义重置函数
    resetFunc: Function as PropType<() => Promise<void>>,
    submitFunc: Function as PropType<() => Promise<void>>,

    // 以下为默认props
    hideRequiredMark: propTypes.bool,

    labelCol: Object as PropType<Partial<ColEx>>,

    layout: propTypes.oneOf(['horizontal', 'vertical', 'inline']).def('horizontal'),

    tableAction: {
        type: Object as PropType<TableActionType>
    },

    wrapperCol: Object as PropType<Partial<ColEx>>,

    colon: propTypes.bool.def(true),

    labelAlign: propTypes.string,

    rowProps: Object as PropType<RowProps>
};
