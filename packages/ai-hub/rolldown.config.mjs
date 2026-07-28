import { defineRolldownLibraryConfig } from '@quantum-design-configs/rolldown';
import pkg from './package.json' with { type: 'json' };

export default defineRolldownLibraryConfig({
    entries: { name: 'ai-hub', input: './src/index.ts', dtsName: 'index' },
    external: ['axios', 'lodash-es', 'qs', '@quantum-design/utils', '@quantum-design/shared'],
    version: pkg.version,
    dts: { tsconfig: './tsconfig.build.json' },
});
