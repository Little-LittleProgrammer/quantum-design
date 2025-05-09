import type { INuxtConfig } from './types';
import fs from 'fs';
import path from 'path';
// 获取base.scss文件
const antdCssStrTemp = (fs.readFileSync(path.resolve('node_modules/@quantum-design/styles/base/base.scss'), 'utf-8').toString().split('// antdend')[0].match(/\$(.*);/g) || []).join(',').replace(/;,/g, '",').replace(/;/g, '"').replace(/: /g, '": "').replace(/\$/g, '"');
const antdCssData = JSON.parse('{' + antdCssStrTemp + '}');

const baseScssFile = "@use '@quantum-design/styles/base/base.scss' as *; @use '@quantum-design/styles/base/mixin.scss' as *;";

export {
    antdCssStrTemp,
    antdCssData,
    baseScssFile
};
function pathResolve(dir: string) {
    return path.resolve(process.cwd(), '.', dir);
}

export const componentsModules: INuxtConfig = {
    app: {
        head: {
            link: [
                {
                    rel: 'stylesheet',
                    href: '/css/antd.css'
                }
            ]
        }
    },
    imports: {
        autoImport: true
    },
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: baseScssFile
                }
            }
        },
        resolve: {
            alias: {
                'ant-design-vue/dist': pathResolve('./node_modules/ant-design-vue/dist'),
                'ant-design-vue/es': pathResolve('./node_modules/ant-design-vue/es'),
                'ant-design-vue/lib': pathResolve('./node_modules/ant-design-vue/es'),
                'ant-design-vue': pathResolve('./node_modules/ant-design-vue/es'),
                '@quantum-design/utils/extra': pathResolve('./node_modules/@quantum-design/utils/dist/extra.esm.min.js'),
                '@quantum-design/utils': pathResolve('./node_modules/@quantum-design/utils/dist/utils.esm.min.js')
            }
        },

        build: {
            rollupOptions: {
                external: ['monaco-editor',
                    'tinymce/tinymce',
                    'tinymce/plugins/anchor',
                    'tinymce/themes/silver',
                    'tinymce/icons/default/icons',
                    'tinymce/plugins/advlist',
                    'tinymce/plugins/autolink',
                    'tinymce/plugins/autosave',
                    'tinymce/plugins/code',
                    'tinymce/plugins/codesample',
                    'tinymce/plugins/directionality',
                    'tinymce/plugins/fullscreen',
                    'tinymce/plugins/hr',
                    'tinymce/plugins/insertdatetime',
                    'tinymce/plugins/link',
                    'tinymce/plugins/lists',
                    'tinymce/plugins/media',
                    'tinymce/plugins/nonbreaking',
                    'tinymce/plugins/noneditable',
                    'tinymce/plugins/pagebreak',
                    'tinymce/plugins/paste',
                    'tinymce/plugins/preview',
                    'tinymce/plugins/print',
                    'tinymce/plugins/save',
                    'tinymce/plugins/searchreplace',
                    'tinymce/plugins/spellchecker',
                    'tinymce/plugins/tabfocus',
                    'tinymce/plugins/template',
                    'tinymce/plugins/textpattern',
                    'tinymce/plugins/visualblocks',
                    'tinymce/plugins/visualchars',
                    'tinymce/plugins/wordcount']
            }
        }
    },
    css: ['@quantum-design/styles/antd/antd.scss', '@quantum-design/styles/base/index.scss']
};
