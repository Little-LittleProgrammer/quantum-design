import { rollup_commpn_lib_config } from '@quantum-design-configs/rollup';

import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

const result = rollup_commpn_lib_config('utils', {
    external: ['dayjs', 'crypto-js', 'crypto-js/aes', 'crypto-js/enc-utf8', 'crypto-js/pad-pkcs7', 'crypto-js/mode-ecb', 'crypto-js/enc-utf8', 'crypto-js/md5', 'crypto-js/sha256']
}, pkg.version);

export default [...Object.values(result)];
