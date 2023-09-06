export interface Options extends TransformOptions {
    components: string[] | false;
    importStyle: 'css' | 'scss' | boolean;
    noStylesComponents: string[];
}

export interface TransformOptions {
    include: RegExp[]
    exclude: RegExp[]
}

declare module '@nuxt/schema' {
    interface NuxtOptions {
        vueAntdPcUi?: Partial<Options>
    }
}
