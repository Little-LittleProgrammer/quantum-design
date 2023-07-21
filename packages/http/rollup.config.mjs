import { rollup_commpn_lib_config } from '@wuefront-configs/rollup';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const pkg = require('./package.json');

const result = rollup_commpn_lib_config('http', {
    external: ['@wuefront/hooks', '@wuefront/hooks/vue', '@wuefront/shared', '@wuefront/shared/enums', '@wuefront/utils', 'axios', 'lodash-es', 'qs']
}, pkg.version);

export default [...Object.values(result)];
