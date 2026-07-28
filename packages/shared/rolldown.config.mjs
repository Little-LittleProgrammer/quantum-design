import { defineRolldownLibraryConfig } from '@quantum-design-configs/rolldown';
import pkg from './package.json' with { type: 'json' };

export default defineRolldownLibraryConfig({
    entries: [
        { name: 'enums', input: './enums/enums.ts', dtsName: 'enums/enums' },
        { name: 'color', input: './color/index.ts', dtsName: 'color/index' },
    ],
    external: ['@ctrl/tinycolor', 'theme-colors'],
    version: pkg.version,
    dts: { tsconfig: './tsconfig.build.json' },
});
