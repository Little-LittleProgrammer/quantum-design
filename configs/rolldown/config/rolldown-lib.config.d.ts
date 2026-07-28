import type { Options as DtsOptions } from 'rolldown-plugin-dts';
import type { OutputOptions, RolldownOptions } from 'rolldown';

export type RolldownLibraryFormat = 'cjs' | 'esm' | 'iife';

export interface RolldownLibraryEntry {
    name: string;
    input?: string;
    dtsName?: string;
    dtsInput?: string;
}

export interface RolldownLibraryConfig extends Omit<RolldownOptions, 'input' | 'output' | 'external' | 'plugins' | 'treeshake'> {
    entries: string | RolldownLibraryEntry | Array<string | RolldownLibraryEntry>;
    formats?: RolldownLibraryFormat[];
    outDir?: string;
    fileName?: string | ((context: { entry: RolldownLibraryEntry; format: RolldownLibraryFormat }) => string);
    external?: RolldownOptions['external'];
    plugins?: RolldownOptions['plugins'];
    output?: OutputOptions;
    dts?: boolean | (DtsOptions & { outDir?: string; external?: RolldownOptions['external'] });
    minify?: OutputOptions['minify'];
    target?: string | string[];
    treeshake?: Exclude<RolldownOptions['treeshake'], boolean>;
    version?: string;
    author?: string;
}

export function defineRolldownLibraryConfig(options: RolldownLibraryConfig): RolldownOptions[];
