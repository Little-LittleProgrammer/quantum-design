<script lang="tsx">
import type { TableSetting, ColumnChangeParam } from '../../types/table';
import ColumnSetting from './column-setting.vue';
import SizeSetting from './size-setting.vue';
import RedoSetting from './redo-setting.vue';
import ExportSetting from './export-setting.vue';
import { type PropType, computed, unref, defineComponent, KeepAlive } from 'vue';
import { useTableContext } from '../../hooks/use-table-context';
import { tableExtraList } from '../../component-map';

const prefixCls = 'q-table-setting';

export default defineComponent({
    name: 'QTableSetting',
    props: {
        setting: {
            type: Object as PropType<TableSetting>,
            default: () => ({}),
        },
    },
    emits: ['columns-change'],
    setup(props, { emit, }) {
        const table = useTableContext();

        const getSetting = computed((): TableSetting => {
            return {
                redo: true,
                size: true,
                setting: true,
                fullScreen: false,
                export: !!table.getBindValues.value.exportSetting?.api,
                ...props.setting,
            };
        });

        const getExtraComponents = computed(() => {
            const extraComponents = table.getBindValues.value.useExtraComponents || [];
            return extraComponents.map((name) => {
                return tableExtraList.get(name);
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
                    const Comp = comp as any;
                    return <Comp key={index} tableApi={table} />;
                })
                .filter(Boolean);
        }

        return () => (
            <div class={prefixCls}>
                {renderExtraComponents()}
                {getSetting.value.export && <ExportSetting getPopupContainer={get_table_container} />}
                {getSetting.value.redo && <RedoSetting getPopupContainer={get_table_container} />}
                {getSetting.value.size && <SizeSetting getPopupContainer={get_table_container} />}
                {getSetting.value.setting && <ColumnSetting onColumnsChange={handle_column_change} getPopupContainer={get_table_container} />}
            </div>
        );
    },
});
</script>
