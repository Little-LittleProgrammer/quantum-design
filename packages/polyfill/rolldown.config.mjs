import { defineRolldownLibraryConfig } from '@quantum-design-configs/rolldown';
import pkg from './package.json' with { type: 'json' };

export default defineRolldownLibraryConfig({
    entries: { name: 'polyfill', input: './index.ts', dtsName: 'index' },
    external: ['@quantum-design/utils'],
    version: pkg.version,
    dts: { tsconfig: './tsconfig.build.json' },
});
