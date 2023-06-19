import { rollup_commpn_lib_config } from '@wuefront-config/rollup';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const pkg = require('./package.json');

const result = rollup_commpn_lib_config('http', {
    external: ['@q-front-npm/hooks', '@q-front-npm/hooks/vue', '@q-front-npm/shared', '@q-front-npm/shared/enums', '@q-front-npm/utils', 'axios', 'lodash-es', 'qs']
}, pkg.version);

export default [...Object.values(result)];
