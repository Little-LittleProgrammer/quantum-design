import { defineRolldownLibraryConfig } from '@quantum-design-configs/rolldown';
import pkg from './package.json' with { type: 'json' };

export default defineRolldownLibraryConfig({
    entries: { name: pkg.name, input: './index.ts', dtsName: 'index' },
    external: ['@protobuf-ts/runtime-http', '@protobuf-ts/runtime-rpc', '@protobuf-ts/runtime'],
    version: pkg.version,
    dts: { tsconfig: './tsconfig.build.json' },
});
