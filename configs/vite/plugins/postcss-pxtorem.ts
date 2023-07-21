import postCssPxtorem from 'postcss-pxtorem';

export function vite_plugin_postcss_pxtorem(rootValue: number): any {
    const postCssPlugin = postCssPxtorem({
        rootValue,
        propList: ['*']
    });
    return postCssPlugin;
}
