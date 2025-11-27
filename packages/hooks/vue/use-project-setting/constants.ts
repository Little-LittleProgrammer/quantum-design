export type BuiltinThemeType = 'custom' | 'deep-blue' | 'deep-green' | 'default' | 'gray' | 'green' | 'neutral' | 'orange' | 'pink' | 'red' | 'rose' | 'sky-blue' | 'slate' | 'stone' | 'violet' | 'yellow' | 'zinc' | (Record<never, never> & string);
export interface BuiltinThemePreset {
    color: string;
    darkPrimaryColor?: string;
    primaryColor?: string;
    type: BuiltinThemeType;
}

const BUILT_IN_THEME_PRESETS: BuiltinThemePreset[] = [
    {
        color: 'hsl(41, 79%, 50%)',
        type: 'default',
    },
    {
        color: 'hsl(245 82% 67%)',
        type: 'violet',
    },
    {
        color: 'hsl(347 77% 60%)',
        type: 'pink',
    },
    {
        color: 'hsl(42 84% 61%)',
        type: 'yellow',
    },
    {
        color: 'hsl(231 98% 65%)',
        type: 'sky-blue',
    },
    {
        color: 'hsl(161 90% 43%)',
        type: 'green',
    },
    {
        color: 'hsl(240 5% 26%)',
        darkPrimaryColor: 'hsl(0 0% 98%)',
        primaryColor: 'hsl(240 5.9% 10%)',
        type: 'zinc',
    },

    {
        color: 'hsl(181 84% 32%)',
        type: 'deep-green',
    },

    {
        color: 'hsl(211 91% 39%)',
        type: 'deep-blue',
    },
    {
        color: 'hsl(18 89% 40%)',
        type: 'orange',
    },
    {
        color: 'hsl(0 75% 42%)',
        type: 'rose',
    },
    {
        color: 'hsl(217 19% 27%)',
        darkPrimaryColor: 'hsl(0 0% 98%)',
        primaryColor: 'hsl(240 5.9% 10%)',
        type: 'gray',
    },
];

export const COLOR_PRESETS = [...BUILT_IN_THEME_PRESETS].slice(0, 7);

export { BUILT_IN_THEME_PRESETS };
