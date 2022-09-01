import { ExtractPropTypes, PropType } from 'vue';

export const themeModeTypes = {
    mode: {
        type: String as PropType<'dark' | 'light'>,
        default: 'light'
    }
};

export type ThemeModeTypes = Partial<ExtractPropTypes<typeof themeModeTypes>>
