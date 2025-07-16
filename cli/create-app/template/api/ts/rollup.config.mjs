import { rollup_commpn_lib_config } from '@quantum-design-configs/rollup';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const pkg = require('./package.json');

const result = rollup_commpn_lib_config(pkg.name, {
    external: ['@protobuf-ts/runtime-http', '@protobuf-ts/runtime-rpc', '@protobuf-ts/runtime']
}, pkg.version);

export default result;
