export interface IExampleData {
    name?: string;
    age?: number;

}

export type IExampleDataTableData = ITableData<keyof IExampleData>