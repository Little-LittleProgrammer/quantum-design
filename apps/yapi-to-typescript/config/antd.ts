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
