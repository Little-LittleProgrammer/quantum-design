export interface BodyTransFactory<T, V> {
    // buildBodyItem(data: T): string;
    buildBody(name: string, des: string, data: V): string;
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
class Factory implements BodyTransFactory<Scheme, Scheme> {
    name: string = ''
    private trans(
        data: Scheme,
        level = 0,
        result: string[] = [],
        name: string | null = null,
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
                result.push(
                    create_formatted_type_from_scheme(
                        name ? `${name}${partial(name, requiredList)}: {` : '{',
                        level
                    )
                );
                level++;
                for (const p in data.properties) {
                    const v = data.properties[p];
                    this.trans(v, level, result, p, data.required);
                }
                result.push(create_formatted_type_from_scheme(`}${level - 1 === 0 ? '' : ';'}`, level - 1));
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
                    result.push(
                        create_formatted_type_from_scheme(
                            name ? `${name}${partial(name, requiredList)}: {` : '{',
                            level
                        )
                    );
                    level++;
                    if (!data.items) return;
                    for (const p in data.items.properties) {
                        const v = data.items.properties[p];
                        this.trans(v, level, result, p, data.items.required);
                    }
                    result.push(create_formatted_type_from_scheme('}[];', level - 1));
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

    buildBody(name: string, des: string, data: Scheme) {
        const _header = [];
        const ENTER = `\n`;
        _header.push(create_formatted_type_from_scheme(`/**`, 0));
        _header.push(create_formatted_type_from_scheme(`/*${des}`, 0));
        _header.push(create_formatted_type_from_scheme(`*/`, 0));
        const resutlArr = this.trans(data, 0, [], null, data?.required ?? []) || [];
        // 修改第一行
        this.name = name;
        const _fline = `export interface ${name} {`;
        resutlArr[0] = _fline;
        // 插入说明
        const result = [..._header, ...resutlArr];
        return result.join(ENTER);
    }
}

export default {
    scheme: new Factory()
};
