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
