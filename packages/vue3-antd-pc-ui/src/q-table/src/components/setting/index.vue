<script lang="tsx">
import type { TableSetting, ColumnChangeParam } from '../../types/table';
import ColumnSetting from './column-setting.vue';
import SizeSetting from './size-setting.vue';
import RedoSetting from './redo-setting.vue';
import ExportSetting from './export-setting.vue';
import { type PropType, computed, unref, defineComponent, onMounted, ref } from 'vue';
import { useTableContext } from '../../hooks/use-table-context';
import { tableExtraList } from '../../component-map';
import { DragHelper } from '../../hooks/use-moveable';
import { SettingOutlined } from '@ant-design/icons-vue';
import { Tooltip } from 'ant-design-vue';
import FullScreenSetting from './fullscreen-setting.vue';

const prefixCls = 'q-table-setting';

export default defineComponent({
    name: 'QTableSetting',
    props: {
        setting: {
            type: Object as PropType<TableSetting>,
            default: () => ({})
        }
    },
    emits: ['columns-change'],
    setup(props, { emit }) {
        const table = useTableContext();
        const isExpanded = ref(false);
        const tableSettingRef = ref<HTMLElement | null>(null);

        const getSetting = computed((): TableSetting => {
            return {
                redo: true,
                size: true,
                setting: true,
                fullScreen: true,
                floating: false,
                export: !!table.getBindValues.value.exportSetting?.api,
                ...props.setting
            };
        });

        const getExtraComponents = computed(() => {
            const extraComponents = table.getBindValues.value.useExtraComponents || [];
            return extraComponents.map((comp) => {
                return {
                    component: tableExtraList.get(comp.component),
                    componentProps: comp.componentProps
                };
            });
        });

        function handle_column_change(data: ColumnChangeParam[]) {
            emit('columns-change', data);
        }

        function get_table_container() {
            return table ? unref(table.wrapRef) : document.body;
        }

        function renderExtraComponents() {
            return getExtraComponents.value
                .map((comp, index) => {
                    if (!comp) return null;
                    const Comp = comp.component as any;
                    return <Comp key={index} tableApi={table} {...comp.componentProps} />;
                })
                .filter(Boolean);
        }

        onMounted(() => {
            if (getSetting.value.floating) {
                const hasPagination = table.getBindValues.value.pagination;
                const tableOptions = {
                    customBounds: {
                        x: 0,
                        y: hasPagination ? 40 : 0
                    }
                };
                new DragHelper(unref(table.tableElRef)!.$el, tableSettingRef.value!, tableOptions);
            }
        });

        function handleFullscreenChange() {
            isExpanded.value = false;
        }

        return () => (
            <div ref={tableSettingRef} class={[prefixCls, { 'float-setting': getSetting.value.floating }]}>
                {getSetting.value.floating ? (
                    <Tooltip
                        v-model:open={isExpanded.value}
                        trigger="click"
                        overlayClassName={`${prefixCls}_tooltip_container`}
                        placement="left"
                        v-slots={{
                            title: () => (
                                <div class={`${prefixCls}__content`}>
                                    {renderExtraComponents()}
                                    {getSetting.value.export && <ExportSetting getPopupContainer={get_table_container} />}
                                    {getSetting.value.fullScreen && <FullScreenSetting onFullscreenChange={handleFullscreenChange} />}
                                    {getSetting.value.redo && <RedoSetting getPopupContainer={get_table_container} />}
                                    {getSetting.value.size && <SizeSetting getPopupContainer={get_table_container} />}
                                    {getSetting.value.setting && <ColumnSetting onColumnsChange={handle_column_change} getPopupContainer={get_table_container} />}
                                </div>
                            )
                        }}
                    >
                        <div class={`${prefixCls}__toggle-btn`}>
                            <SettingOutlined rotate={isExpanded.value ? 90 : 0} />
                        </div>
                    </Tooltip>
                ) : (
                    <div class={`${prefixCls}__content`}>
                        {renderExtraComponents()}
                        {getSetting.value.export && <ExportSetting getPopupContainer={get_table_container} />}
                        {getSetting.value.fullScreen && <FullScreenSetting />}
                        {getSetting.value.redo && <RedoSetting getPopupContainer={get_table_container} />}
                        {getSetting.value.size && <SizeSetting getPopupContainer={get_table_container} />}
                        {getSetting.value.setting && <ColumnSetting onColumnsChange={handle_column_change} getPopupContainer={get_table_container} />}
                    </div>
                )}
            </div>
        );
    }
});
</script>
