export interface IExportOptions {
    apiFunc: PromiseFn,
    params: Record<string, any> | Fn<Record<string, any>>
}
