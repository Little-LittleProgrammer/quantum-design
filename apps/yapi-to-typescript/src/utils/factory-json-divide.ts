import { prop_to_pascal } from './tools';

export interface BodyTransFactory<T, V> {
    // buildBodyItem(data: T): string;
    buildBody(name: string, data: V, nameKey: string, des: string): void;
    get(): string
}

export interface Scheme {
    // string|number|object|array等
    type: string;
    // type 为 object的时候，该属性存在
    properties?: Record<string, Scheme>;
    // type为object 或者array的时候，该属性存在，标记哪些属性是必须的
    required?: string[];
    // 描述
    description?: string;
    // 当type为array的时候，该属性存在
    items?: Scheme;
}
function create_formatted_type_from_scheme(content: string = '', level = 0) {
    return '    '.repeat(level) + content;
}
function partial(name: string | null, requiredList?: string[]) {
    return requiredList?.includes(name ?? '') ? '' : '?';
}
const ENTER = `\n`;
export class FactoryJson implements BodyTransFactory<Scheme, Scheme> {
    name: string = '';
    result: string[][] = [];
    constructor(name: string, data: Scheme, des: string = '') {
        this.name = name;
        this.buildBody(name, data, des);
    }
    private trans(
        data: Scheme,
        level = 0,
        result: string[] = [],
        name: string | null = null,
        parentName: string = '',
        requiredList?: string[]
    ) {
        // 对象
        if (data.description) {
            result.push(create_formatted_type_from_scheme(`/**`, level));
            result.push(
                create_formatted_type_from_scheme(`/*${data.description}`, level)
            );
            result.push(create_formatted_type_from_scheme(` */`, level));
        }

        switch (data.type) {
            case 'object': {
                const _nameCur = `${parentName}${prop_to_pascal(name || '', '_')}`;
                result.push(
                    create_formatted_type_from_scheme(
                        name ? `${name}${partial(name, requiredList)}: ${_nameCur}` : `: ${_nameCur}`,
                        level
                    )
                );
                level++;
                this.buildBody(_nameCur, data);
                break;
            }
            case 'array': {
                if (data.items && data.items.type !== 'object') {
                    result.push(
                        create_formatted_type_from_scheme(
                            name
                                ? `${name}${partial(name, requiredList)}: ${data.items.type}[];`
                                : `${data.items.type}[];`,
                            level
                        )
                    );
                } else {
                    const _nameCur = `${parentName}${prop_to_pascal(name || '', '_')}`;
                    result.push(
                        create_formatted_type_from_scheme(
                            name ? `${name}${partial(name, requiredList)}: ${_nameCur}[]` : `: ${_nameCur}[]`,
                            level
                        )
                    );
                    level++;
                    if (!data.items) return;
                    this.buildBody(_nameCur, data.items);
                }
                break;
            }
            default: {
                result.push(
                    create_formatted_type_from_scheme(
                        `${name}${partial(name, requiredList)}: ${data.type};`,
                        level
                    )
                );
            }
        }
        return result;
    }

    buildBody(name: string, data: Scheme, des?: string) {
        const _annotion = [];
        const _resutlArr:string[] = [];
        for (const key in data.properties) {
            const _arr = new Array(0);
            const _val = data.properties[key];
            _resutlArr.push((this.trans(_val, 1, _arr, key, name, data?.required ?? []) || []).join(ENTER));
        }
        if (des) {
            _annotion.push(create_formatted_type_from_scheme(`/**`, 0));
            _annotion.push(create_formatted_type_from_scheme(`/*${des}`, 0));
            _annotion.push(create_formatted_type_from_scheme(`*/`, 0));
        }
        // 修改第一行
        _resutlArr.unshift(`export interface ${name} {`);
        _resutlArr.push('}');
        // 插入说明
        this.result.push([..._annotion, ..._resutlArr]);
    }
    get() {
        console.log(this.result);
        return this.result.flat().join(ENTER);
    }
}
