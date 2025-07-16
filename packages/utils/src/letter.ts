/**
 * 将字符串的首字母大写
 * @param string
 */
function js_utils_capitalize_first_letter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
   * 将字符串的首字母转换为小写。
   *
   * @param str 要转换的字符串
   * @returns 首字母小写的字符串
   */
function js_utils_to_lower_case_first_letter(str: string): string {
    if (!str) return str; // 如果字符串为空，直接返回
    return str.charAt(0).toLowerCase() + str.slice(1);
}

/**
   *  生成驼峰命名法的键名
   * @param key
   * @param parentKey
   */
function js_utils_to_camel_case(key: string, parentKey: string): string {
    if (!parentKey) {
        return key;
    }
    return parentKey + key.charAt(0).toUpperCase() + key.slice(1);
}

function js_utils_kebab_to_camel_case(str: string): string {
    return str
        .split('-')
        .filter(Boolean)
        .map((word, index) =>
            index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join('');
}

export {
    js_utils_capitalize_first_letter,
    js_utils_kebab_to_camel_case,
    js_utils_to_camel_case,
    js_utils_to_lower_case_first_letter
};

