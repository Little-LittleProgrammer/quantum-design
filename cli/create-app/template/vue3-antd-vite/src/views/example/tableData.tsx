export function getBasicColumns(): BasicColumn[] {
    return [
        {
            title: 'ID',
            dataIndex: 'id',
            fixed: 'left',
            width: 200
        },
        {
            title: '姓名',
            dataIndex: 'name',
            width: 150,
            filters: [
                { text: 'Male', value: 'male' },
                { text: 'Female', value: 'female' }
            ],
            key: 'name',
            editRule: true,
            helpMessage: '你好',
            editRow: true,
            editComponent: 'Input'
        },
        {
            title: '地址',
            dataIndex: 'address'
        },
        {
            title: '编号',
            dataIndex: 'no',
            width: 150,
            sorter: true,
            defaultHidden: true
        },
        {
            title: '开始时间',
            width: 150,
            sorter: true,
            dataIndex: 'beginTime'
        },
        {
            title: '结束时间',
            width: 150,
            sorter: true,
            dataIndex: 'endTime'
        }
    ];
}

export function getBasicData() {
    return (() => {
        const arr: any = [];
        for (let index = 0; index < 40; index++) {
            arr.push({
                id: `${index}`,
                name: 'John Brown',
                age: `1${index}`,
                no: `${index + 10}`,
                address: 'New York No. 1 Lake ParkNew York No. 1 Lake Park',
                beginTime: new Date().toLocaleString(),
                endTime: new Date().toLocaleString()
            });
        }
        return arr;
    })();
}

export function getTreeTableData() {
    return (() => {
        const arr: any = [];
        for (let index = 0; index < 40; index++) {
            arr.push({
                id: `${index}`,
                name: 'John Brown',
                age: `1${index}`,
                no: `${index + 10}`,
                address: 'New York No. 1 Lake ParkNew York No. 1 Lake Park',
                beginTime: new Date().toLocaleString(),
                endTime: new Date().toLocaleString(),
                children: [
                    {
                        id: `l2-${index}`,
                        name: 'John Brown',
                        age: `1${index}`,
                        no: `${index + 10}`,
                        address: 'New York No. 1 Lake ParkNew York No. 1 Lake Park',
                        beginTime: new Date().toLocaleString(),
                        endTime: new Date().toLocaleString()
                    }
                ]
            });
        }
        return arr;
    })();
}

