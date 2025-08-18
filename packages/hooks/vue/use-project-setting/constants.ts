export type BuiltinThemeType = 'default' | 'custom';
interface BuiltinThemePreset {
    color: string;
    darkPrimaryColor?: string;
    primaryColor?: string;
    type: BuiltinThemeType;
}

const BUILT_IN_THEME_PRESETS: BuiltinThemePreset[] = [
    {
        color: 'hsl(42, 90%, 90%)',
        type: 'default',
    },
    {
        color: '',
        type: 'custom',
    },
];

export const COLOR_PRESETS = [...BUILT_IN_THEME_PRESETS].slice(0, 7);

export { BUILT_IN_THEME_PRESETS };

export type { BuiltinThemePreset };
