# 递归表格

## Usage

<code-view title="基本用法" description="基本treetable用法">
    <div style="overflow:hidden;width:100%">
        <ClientOnly>
            <q-tree-table :header="header" :treeData="data.dataTree">
                <!-- <template #header="scope">{{ scope.hKey }}</template> -->
                <!-- scope: {cell, parent, index, headerKey, cIndex}  cell当前单元格数据，parent:父级单元格数据，index行下标, headerKey当前单元格对应的表格头字段, cIndex当前单元格在父单元格children的下标-->
                <template #default="{ headerKey, cell, parent, index }">
                    <div v-if="(headerKey == 'title2' || headerKey == 'title3' || headerKey == 'title7') && index === 0">
                        <a-input :value="cell.data[key]"></a-input>
                        <button @click="add({ headerKey, cell, parent, index })">添加</button>
                    </div>
                    <span v-else><a-input :value="cell.data[key]"></a-input></span>
                </template>
            </q-tree-table>
        </ClientOnly>
    </div>
    <template #codeText>
        <highlight-code :code="code"/>
    </template>
</code-view>

<script setup>
    import {reactive} from 'vue'
    // import {QTreeTable} from '@quantum-design/vue3-pc-ui'
    const tags = ['title1', 'title2', 'title3', 'title7']

    const header = {
        title1: '标题1',
        title2: '标题2',
        title3: '标题3',
        title7: {
            title7: '标题7',
            data: '配置'
        }
    };

    const dataTree = [
        {
            key: 'title1', // direct_type
            data: { // 
            }, 
            config: { 
            },
            title1: '122323',
            children: [
                {
                    data: { // 
                    }, 
                    config: { 
                    },
                    key: 'title2', // direct_type
                    children: [{

                        key: 'title3', // direct_type
                        data: {},
                        config: {}, 
                        children: [{
                            key: 'title7', // direct_type
                            data: {},
                            config: {},
                            sub_key: ['title7', 'data'], // 最后 一层,
                        }]
                    }]
                }
            ]
        }
    ];


// 表格的dateTree数据要是一个响应式数据
    const data = reactive({
        dataTree
    })

    // 点击添加按钮
    const add = ({cell, parent, index}) => {
        const _index = tags.indexOf(cell.key || '');
        let _obj= {};
        let _p = {};
        for (let i = _index; i < tags.length; i++) {
            const _o = {
                key: tags[i],
                config: {},
                data: {}
            };
            _o[_o.key] = {};
            if (typeof header[_o.key] === 'object') {
                _o.sub_key = Object.keys(header[_o.key]);
                _o.sub_key.forEach((_k) => {
                    _o[_k] = {};
                });
            }
            if (i !== tags.length - 1) {
                _o.children = [];
            }
            if (cell.level && i === cell.level - 1) {
                _p = _o;
            } else {
                _obj.children && _obj.children.push(_o);
            }
            _obj = _o;
        }
        if (_index === 0) {
            data.dataTree.push(_p);
        } else {
            parent.children && parent.children.push(_p);
        }
        console.log(data.dataTree)
    }
    const code = `
    <q-tree-table :header="header" :treeData="data.dataTree">
            <!-- <template #header="scope">{{ scope.hKey }}</template> -->
            <!-- scope: {cell, parent, index, headerKey, cIndex}  cell当前单元格数据，parent:父级单元格数据，index行下标, headerKey当前单元格对应的表格头字段, cIndex当前单元格在父单元格children的下标-->
            <template #default="{ headerKey, cell, parent, index }">
                <Input v-model:value="cell.data[key]"></Input>
            </template>
        </q-tree-table>
        
        <script setup>

        import {QTreeTable} from '@quantum-design/vue3-pc-ui';
        import {reactive} from 'vue'
             const header = {
                title1: '标题1',
                title2: '标题2',
                title3: '标题3',
                title7: {
                    title7: '标题7',
                    data: '配置'
                }
            };

            const dataTree = [
                {
                    key: 'title1', // direct_type
                    data: { // 
                    }, 
                    config: { 
                    },
                    title1: '122323',
                    children: [
                        {
                            data: { // 
                            }, 
                            config: { 
                            },
                            key: 'title2', // direct_type
                            children: [{

                                key: 'title3', // direct_type
                                data: {},
                                config: {}, 
                                children: [{
                                    key: 'title7', // direct_type
                                    data: {},
                                    config: {},
                                    sub_key: ['title7', 'data'], // 最后 一层,
                                }]
                            }]
                        }
                    ]
                }
            ];
        \<\/\script>`

</script>
