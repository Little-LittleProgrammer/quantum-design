// 驼峰变为链接符
export function kebab_case(key: string) {
    const result = key.replace(/([A-Z])/g, ' $1').trim();
    return result.split(' ').join('-').toLowerCase();
}

// 变为驼峰
export function camelize(value: string): string {
    return value.replace(/(^|-)(\w)/g, (a, b, c) => c.toUpperCase());
}

export function to_reg_exp(arr: string[], flags?: string): RegExp {
    return new RegExp(`\\b(${arr.join('|')})\\b`, flags);
}

export function gen_side_effects_import(value: string): string {
    return `import '${value}';`;
}
