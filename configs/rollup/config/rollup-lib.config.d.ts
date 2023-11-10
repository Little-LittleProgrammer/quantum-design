import type { RollupOptions } from "rollup";

interface IPkgList {
    name: string,
    input?: string
}

export function rollup_commpn_lib_config(pkgList: IPkgList | string | IPkgList[], rollupOptions: RollupOptions, version?: string): any[]