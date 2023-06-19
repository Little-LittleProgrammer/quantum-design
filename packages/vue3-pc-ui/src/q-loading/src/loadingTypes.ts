import { ExtractPropTypes } from 'vue';

export const loadingProps = {
    loading: {
        type: Boolean,
        default: false
    },
    mode: {
        type: String,
        default: 'wave'
    },
    size: {
        type: String,
        default: 'default'
    }
};

export type LoadingProps = Partial<ExtractPropTypes<typeof loadingProps>>
