import { describe, it, expect } from 'vitest';
import { js_utils_capitalize_first_letter, js_utils_kebab_to_camel_case, js_utils_to_camel_case, js_utils_to_lower_case_first_letter } from '../src/letter';

describe('letter.ts', () => {
    describe('js_utils_capitalize_first_letter', () => {
        it('应该将首字母转换为大写', () => {
            expect(js_utils_capitalize_first_letter('hello')).toBe('Hello');
            expect(js_utils_capitalize_first_letter('world')).toBe('World');
            expect(js_utils_capitalize_first_letter('test')).toBe('Test');
        });

        it('应该保持已经是大写的首字母', () => {
            expect(js_utils_capitalize_first_letter('Hello')).toBe('Hello');
            expect(js_utils_capitalize_first_letter('WORLD')).toBe('WORLD');
        });

        it('应该处理单个字符', () => {
            expect(js_utils_capitalize_first_letter('a')).toBe('A');
            expect(js_utils_capitalize_first_letter('Z')).toBe('Z');
        });

        it('应该处理空字符串', () => {
            expect(js_utils_capitalize_first_letter('')).toBe('');
        });

        it('应该只转换首字母，保持其他字母不变', () => {
            expect(js_utils_capitalize_first_letter('hELLO')).toBe('HELLO');
            expect(js_utils_capitalize_first_letter('wOrLd')).toBe('WOrLd');
        });

        it('应该处理包含空格的字符串', () => {
            expect(js_utils_capitalize_first_letter('hello world')).toBe('Hello world');
            expect(js_utils_capitalize_first_letter(' hello')).toBe(' hello');
        });

        it('应该处理数字开头的字符串', () => {
            expect(js_utils_capitalize_first_letter('123abc')).toBe('123abc');
        });

        it('应该处理特殊字符开头的字符串', () => {
            expect(js_utils_capitalize_first_letter('$hello')).toBe('$hello');
            expect(js_utils_capitalize_first_letter('@world')).toBe('@world');
        });
    });

    describe('js_utils_to_lower_case_first_letter', () => {
        it('应该将首字母转换为小写', () => {
            expect(js_utils_to_lower_case_first_letter('Hello')).toBe('hello');
            expect(js_utils_to_lower_case_first_letter('World')).toBe('world');
            expect(js_utils_to_lower_case_first_letter('Test')).toBe('test');
        });

        it('应该保持已经是小写的首字母', () => {
            expect(js_utils_to_lower_case_first_letter('hello')).toBe('hello');
            expect(js_utils_to_lower_case_first_letter('world')).toBe('world');
        });

        it('应该处理单个字符', () => {
            expect(js_utils_to_lower_case_first_letter('A')).toBe('a');
            expect(js_utils_to_lower_case_first_letter('z')).toBe('z');
        });

        it('应该处理空字符串', () => {
            expect(js_utils_to_lower_case_first_letter('')).toBe('');
        });

        it('应该只转换首字母，保持其他字母不变', () => {
            expect(js_utils_to_lower_case_first_letter('HELLO')).toBe('hELLO');
            expect(js_utils_to_lower_case_first_letter('WoRLd')).toBe('woRLd');
        });

        it('应该处理包含空格的字符串', () => {
            expect(js_utils_to_lower_case_first_letter('Hello World')).toBe('hello World');
            expect(js_utils_to_lower_case_first_letter(' Hello')).toBe(' Hello');
        });

        it('应该处理数字开头的字符串', () => {
            expect(js_utils_to_lower_case_first_letter('123ABC')).toBe('123ABC');
        });

        it('应该处理特殊字符开头的字符串', () => {
            expect(js_utils_to_lower_case_first_letter('$Hello')).toBe('$Hello');
            expect(js_utils_to_lower_case_first_letter('@World')).toBe('@World');
        });

        it('应该处理 undefined 和 null（虽然类型不匹配）', () => {
            expect(js_utils_to_lower_case_first_letter(undefined as any)).toBe(undefined);
            expect(js_utils_to_lower_case_first_letter(null as any)).toBe(null);
        });
    });

    describe('js_utils_to_camel_case', () => {
        it('应该生成驼峰命名', () => {
            expect(js_utils_to_camel_case('name', 'user')).toBe('userName');
            expect(js_utils_to_camel_case('id', 'user')).toBe('userId');
            expect(js_utils_to_camel_case('count', 'total')).toBe('totalCount');
        });

        it('没有父键时应该返回原键名', () => {
            expect(js_utils_to_camel_case('name', '')).toBe('name');
            expect(js_utils_to_camel_case('id', '')).toBe('id');
        });

        it('应该正确处理首字母大写', () => {
            expect(js_utils_to_camel_case('Name', 'user')).toBe('userName');
            expect(js_utils_to_camel_case('ID', 'user')).toBe('userID');
        });

        it('应该处理多层嵌套', () => {
            const result1 = js_utils_to_camel_case('name', 'user');
            expect(result1).toBe('userName');

            const result2 = js_utils_to_camel_case('first', result1);
            expect(result2).toBe('userNameFirst');
        });

        it('应该处理单个字符的键', () => {
            expect(js_utils_to_camel_case('x', 'point')).toBe('pointX');
            expect(js_utils_to_camel_case('y', 'point')).toBe('pointY');
        });

        it('应该处理已经是驼峰的键', () => {
            expect(js_utils_to_camel_case('firstName', 'user')).toBe('userFirstName');
        });

        it('应该处理空字符串键', () => {
            expect(js_utils_to_camel_case('', 'user')).toBe('user');
        });
    });

    describe('js_utils_kebab_to_camel_case', () => {
        it('应该将 kebab-case 转换为 camelCase', () => {
            expect(js_utils_kebab_to_camel_case('hello-world')).toBe('helloWorld');
            expect(js_utils_kebab_to_camel_case('user-name')).toBe('userName');
            expect(js_utils_kebab_to_camel_case('data-id')).toBe('dataId');
        });

        it('应该处理多个连字符', () => {
            expect(js_utils_kebab_to_camel_case('my-long-variable-name')).toBe('myLongVariableName');
            expect(js_utils_kebab_to_camel_case('a-b-c-d')).toBe('aBCD');
        });

        it('应该保持第一个单词小写', () => {
            expect(js_utils_kebab_to_camel_case('hello-world')).toBe('helloWorld');
            // 第一个单词会转为小写，后续单词首字母大写
            expect(js_utils_kebab_to_camel_case('Hello-World')).toBe('HelloWorld');
        });

        it('应该处理没有连字符的字符串', () => {
            expect(js_utils_kebab_to_camel_case('hello')).toBe('hello');
            expect(js_utils_kebab_to_camel_case('world')).toBe('world');
        });

        it('应该处理空字符串', () => {
            expect(js_utils_kebab_to_camel_case('')).toBe('');
        });

        it('应该过滤空分段', () => {
            expect(js_utils_kebab_to_camel_case('hello--world')).toBe('helloWorld');
            expect(js_utils_kebab_to_camel_case('-hello-world')).toBe('helloWorld');
            expect(js_utils_kebab_to_camel_case('hello-world-')).toBe('helloWorld');
        });

        it('应该处理单个连字符', () => {
            expect(js_utils_kebab_to_camel_case('-')).toBe('');
            expect(js_utils_kebab_to_camel_case('--')).toBe('');
        });

        it('应该处理只有一个单词的情况', () => {
            expect(js_utils_kebab_to_camel_case('hello-')).toBe('hello');
            expect(js_utils_kebab_to_camel_case('-hello')).toBe('hello');
        });

        it('应该处理数字', () => {
            expect(js_utils_kebab_to_camel_case('item-1')).toBe('item1');
            expect(js_utils_kebab_to_camel_case('value-2-test')).toBe('value2Test');
        });

        it('应该处理大写字母', () => {
            // 分割后会变成 ['USER', 'NAME']，第一个保持原样，后面首字母大写
            expect(js_utils_kebab_to_camel_case('USER-NAME')).toBe('USERNAME');
            expect(js_utils_kebab_to_camel_case('DATA-ID')).toBe('DATAID');
        });

        it('应该处理混合大小写', () => {
            // 第一个单词保持原样，后续单词首字母大写
            expect(js_utils_kebab_to_camel_case('Hello-World-Test')).toBe('HelloWorldTest');
            expect(js_utils_kebab_to_camel_case('myVar-Name')).toBe('myVarName');
        });
    });

    describe('综合测试', () => {
        it('应该能够组合使用各种函数', () => {
            const kebab = 'user-first-name';
            const camel = js_utils_kebab_to_camel_case(kebab);
            expect(camel).toBe('userFirstName');

            const capitalized = js_utils_capitalize_first_letter(camel);
            expect(capitalized).toBe('UserFirstName');

            const lowerFirst = js_utils_to_lower_case_first_letter(capitalized);
            expect(lowerFirst).toBe('userFirstName');
        });

        it('应该能够处理复杂的命名转换场景', () => {
            // kebab-case -> camelCase
            const str1 = 'my-component-name';
            const camelCase = js_utils_kebab_to_camel_case(str1);
            expect(camelCase).toBe('myComponentName');

            // camelCase -> PascalCase
            const pascalCase = js_utils_capitalize_first_letter(camelCase);
            expect(pascalCase).toBe('MyComponentName');

            // PascalCase -> camelCase
            const backToCamel = js_utils_to_lower_case_first_letter(pascalCase);
            expect(backToCamel).toBe('myComponentName');
        });

        it('应该能够构建嵌套属性名', () => {
            const prop1 = 'user';
            const prop2 = 'profile';
            const prop3 = 'name';

            const nested1 = js_utils_to_camel_case(prop2, prop1);
            expect(nested1).toBe('userProfile');

            const nested2 = js_utils_to_camel_case(prop3, nested1);
            expect(nested2).toBe('userProfileName');
        });
    });
});
