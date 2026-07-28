import { defineRolldownLibraryConfig } from '@quantum-design-configs/rolldown';
import pkg from './package.json' with { type: 'json' };

export default defineRolldownLibraryConfig({
    entries: { name: 'http', input: './index.ts', dtsName: 'index' },
    external: ['@quantum-design/utils', '@quantum-design/utils/extra', 'axios', 'lodash-es', 'qs'],
    version: pkg.version,
    dts: { tsconfig: './tsconfig.build.json' },
});
