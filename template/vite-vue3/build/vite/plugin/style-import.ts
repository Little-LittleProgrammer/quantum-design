import styleImport from 'vite-plugin-style-import';

// 因使用主题更换, 已经全量引入了ant-design的样式, 所以不需要按需引入
// PS: 没有什么好的方法来避免
export function configStyleImportPlugin(isBuild: boolean) {
    // if (!isBuild) return [];
    // const styleImportPlugin = styleImport({
    //     libs: [
    //         {
    //             libraryName: 'ant-design-vue',
    //             esModule: true,
    //             resolveStyle: (name) => {
    //                 return `ant-design-vue/es/${name}/style/index`;
    //             }
    //         }
    //     ]
    // });
    // return styleImportPlugin;
    return [];
}
