import type { ExtractPropTypes } from 'vue';

export const tagProps = {
    value: {
        type: String,
        default: ''
    }
};

export type TagProps = Partial<ExtractPropTypes<typeof tagProps>>
