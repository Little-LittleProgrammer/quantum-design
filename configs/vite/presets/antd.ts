import fs from 'fs';
import path from 'path';
const OUTPUT_DIR = 'dist';
// 获取base.scss文件
const _antdCssStrTemp = (fs.readFileSync(path.resolve('node_modules/@wuefront/shared/style/antd/base.scss'), 'utf-8').toString().split('// antdend')[0].match(/\$(.*);/g) || []).join(',').replace(/;,/g, '",').replace(/;/g, '"').replace(/: /g, '": "').replace(/\$/g, '"');
const _antdCssData = JSON.parse('{' + _antdCssStrTemp + '}');

const _baseScssFile = "@import '@wuefront/shared/style/base/base.scss'; @import '@wuefront/shared/style/base/mixin.scss';";

export {
    _antdCssData,
    OUTPUT_DIR,
    _baseScssFile
};
