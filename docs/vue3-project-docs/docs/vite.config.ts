import { UserConfig } from 'vite';
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import fs from 'fs';
import path from 'path';


// 获取base.scss文件
const _antdCssStrTemp = fs.readFileSync(path.resolve('node_modules/@wuefront/shared/style/antd/base.scss'), 'utf-8').toString().split('// antdend')[0].match(/\$(.*);/g)!.join(',').replace(/;,/g, '",').replace(/;/g, '"').replace(/: /g, '": "').replace(/\$/g, '"');
const _antdCssData = JSON.parse('{' + _antdCssStrTemp + '}');

const _baseScssFile = "@import '@wuefront/shared/style/base/base.scss'; @import '@wuefront/shared/style/base/mixin.scss'; @import '../docs/.vitepress/theme/styles/custom.scss';";


const config: UserConfig = {
    base: '/',
    css: {
        preprocessorOptions: {
            less: {
                javascriptEnabled: true,
                modifyVars: _antdCssData,
            },
            scss: {
                additionalData: _baseScssFile
            }
        }
    },
    server: {
        host: true,
        port: 9090
    },
    plugins: [
        Components({
            resolvers: [AntDesignVueResolver({
                importStyle: 'less'
            })],
        })
    ],
    resolve: {
        alias: {
            '@components/ad.qmniu.com': 'ad.qmniu.com/src/components',
            '@components/qmdsp.qmniu.com': 'qmdsp.qmniu.com/src/components',
            '@components/qmdsp.qimao.com': 'qmdsp.qimao.com/src/components',
        }
    }
}
export default config