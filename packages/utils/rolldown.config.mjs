import { defineRolldownLibraryConfig } from '@quantum-design-configs/rolldown';
import pkg from './package.json' with { type: 'json' };

const entries = [
    { name: 'utils', input: './index.ts', dtsName: 'index' },
    { name: 'extra', input: './extra.ts', dtsName: 'extra' },
];

const external = [
    'dayjs',
    'crypto-js',
    'crypto-js/aes',
    'crypto-js/enc-utf8',
    'crypto-js/pad-pkcs7',
    'crypto-js/mode-ecb',
    'crypto-js/md5',
    'crypto-js/sha256',
];

const libraryConfig = defineRolldownLibraryConfig({
    entries,
    external,
    version: pkg.version,
    dts: { tsconfig: './tsconfig.build.json' },
});

const nodeEsmConfig = defineRolldownLibraryConfig({
    entries,
    formats: ['esm'],
    external: ['dayjs'],
    version: pkg.version,
    fileName: ({ entry }) => `${entry.name}.mjs`,
    output: { cleanDir: false },
});

export default [...libraryConfig, ...nodeEsmConfig];
