import { rollup_commpn_lib_config } from '@wuefront-configs/rollup';

import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

const result = rollup_commpn_lib_config('utils', {
    external: ['dayjs', 'crypto-js']
}, pkg.version);

export default [...Object.values(result)];
