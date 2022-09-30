import { computed } from 'vue';
import { FormSchema } from '../types/form';

export function defineSchemas(schemas: FormSchema[]) {
    const schemasRef = computed(() => {
        return schemas;
    });
    return schemasRef;
}
