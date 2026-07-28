import { createRequire } from 'node:module';
import { defineConfig } from 'rolldown';
import { dts as createDtsPlugin } from 'rolldown-plugin-dts';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');

const FORMAT_MAP = {
    esm: 'es',
    cjs: 'cjs',
    iife: 'iife',
};

function normalizeEntries(entries) {
    const normalized = typeof entries === 'string' ? [{ name: entries }] : Array.isArray(entries) ? entries : [entries];

    return normalized.map((entry) =>
        typeof entry === 'string'
            ? { name: entry, input: './index.ts' }
            : {
                  input: './index.ts',
                  ...entry,
              },
    );
}

function resolveFileName(fileName, entry, format) {
    if (typeof fileName === 'function') {
        return fileName({ entry, format });
    }

    if (typeof fileName === 'string') {
        return fileName.replaceAll('[name]', entry.name).replaceAll('[format]', format);
    }

    return `${entry.name}.${format}.min.js`;
}

function createDeclarationConfig(entries, dts, outDir, external) {
    const dtsOptions = dts === true ? {} : dts;
    const { outDir: declarationOutDir, external: declarationExternal = external, ...pluginOptions } = dtsOptions;
    const input = Object.fromEntries(entries.map((entry) => [entry.dtsName || entry.name, entry.dtsInput || entry.input]));

    return {
        input,
        external: declarationExternal,
        plugins: [
            createDtsPlugin({
                emitDtsOnly: true,
                generator: 'tsc',
                parallel: false,
                ...pluginOptions,
            }),
        ],
        output: {
            cleanDir: false,
            dir: declarationOutDir || `${outDir}/types`,
            format: 'es',
        },
    };
}

export function defineRolldownLibraryConfig(options) {
    const { entries, formats = ['cjs', 'esm'], outDir = 'dist', fileName, external = [], plugins = [], output = {}, dts = false, minify = true, platform, target = 'es2015', treeshake = {}, version = pkg.version, author = pkg.author, ...inputOptions } = options;
    const normalizedEntries = normalizeEntries(entries);
    const configs = normalizedEntries.flatMap((entry, entryIndex) =>
        formats.map((format, formatIndex) => ({
            ...inputOptions,
            input: entry.input,
            external,
            platform,
            plugins,
            transform: {
                target,
                ...inputOptions.transform,
            },
            treeshake: {
                moduleSideEffects: false,
                manualPureFunctions: ['console.log'],
                ...treeshake,
            },
            output: {
                cleanDir: entryIndex === 0 && formatIndex === 0,
                dir: outDir,
                codeSplitting: false,
                entryFileNames: resolveFileName(fileName, entry, format),
                format: FORMAT_MAP[format],
                sourcemap: false,
                minify,
                banner: `/*! name: ${entry.name} version: ${version}\n author: ${author} */`,
                footer: '/*! join us */',
                ...output,
            },
        })),
    );

    if (dts) {
        configs.push(createDeclarationConfig(normalizedEntries, dts, outDir, external));
    }

    return defineConfig(configs);
}
