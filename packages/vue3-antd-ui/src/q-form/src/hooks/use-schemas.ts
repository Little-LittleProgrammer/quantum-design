import { computed } from 'vue';
import { FormSchema } from '../types/form';

export function defineSchemas<T extends object = Record<string, any>, C extends string = ''>(schemaList: FormSchema<T, C>[]) {
    const schemas = computed<FormSchema<any, string>[]>(() => {
        return schemaList;
    });
    return {schemas};
}
