export interface TreeTableData {
    key?: string,
    sub_key?: any[],
    value?: any,
    level?: number,
    children?: TreeTableData[],
    [props: string]: any
}
