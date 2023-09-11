import { INuxtConfig } from './types';
import fs from 'fs';
import path from 'path';
// 获取base.scss文件
const antdCssStrTemp = (fs.readFileSync(path.resolve('node_modules/@quantum-design/shared/style/antd/base.scss'), 'utf-8').toString().split('// antdend')[0].match(/\$(.*);/g) || []).join(',').replace(/;,/g, '",').replace(/;/g, '"').replace(/: /g, '": "').replace(/\$/g, '"');
const antdCssData = JSON.parse('{' + antdCssStrTemp + '}');

const baseScssFile = "@import '@quantum-design/shared/style/base/base.scss'; @import '@quantum-design/shared/style/base/mixin.scss';";

export {
    antdCssStrTemp,
    antdCssData,
    baseScssFile
};

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
                'ant-design-vue/dist': 'ant-design-vue/dist',
                'ant-design-vue/es': 'ant-design-vue/es',
                'ant-design-vue/lib': 'ant-design-vue/es',
                'ant-design-vue': 'ant-design-vue/es'
            }
        }
    },
    css: ['@quantum-design/shared/style/antd/antd.scss', '@quantum-design/shared/style/base/index.scss']
};
