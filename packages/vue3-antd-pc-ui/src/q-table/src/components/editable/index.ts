import { type Ref, h, toRaw } from 'vue';
import type { BasicColumn, Recordable } from '../../types/table';
import { isArray } from '@quantum-design/utils';
import EditableCell from './editable-cell.vue';

interface Params {
    text: string;
    record: Recordable;
    index: number;
}

export type EditRecordRow<T = Recordable> = Partial<
{
    onEdit: (editable: boolean, submit?: boolean) => Promise<boolean>;
    onValid: () => Promise<boolean>;
    editable: boolean;
    onCancel: Fn;
    onSubmit: Fn;
    submitCbs: Fn[];
    cancelCbs: Fn[];
    validCbs: Fn[];
    editValueRefs: Recordable<Ref>;
} & T
>;

export function render_edit_cell(column: BasicColumn) {
    return ({text: value, record, index}: Params) => {
        toRaw(record).onValid = async() => {
            if (isArray(record?.validCbs)) {
                const _validFns = (record?.validCbs || []).map((fn) => fn());
                const _res = await Promise.all(_validFns);
                return _res.every(item => !!item);
            } else {
                return false;
            }
        };

        async function on_edit(edit:boolean = true, submit = false) {
            if (!submit) {
                record.editable = edit;
            }
            if (!edit && submit) {
                if (!(await record.onValid())) return false;
                const _res = await record.onSubmitEdit?.();
                if (_res) {
                    record.editable = false;
                    return true;
                }
                return false;
            }
            // cancel
            if (!edit && !submit) {
                record.onCancelEdit?.();
            }
            return true;
        }

        toRaw(record).onEdit = on_edit;
        toRaw(record).onSubmit = () => on_edit(false, true);
        toRaw(record).onCancel = () => on_edit(false);
        return h(EditableCell, {
            value,
            record,
            column,
            index
        });
    };
}
