import { describe, it, expect } from 'vitest';
import { js_utils_dom_add_class, js_utils_dom_has_class, js_utils_dom_remove_class, js_utils_update_css_variables } from '../src/dom-util';

describe('cipher.ts', () => {
    const $dom = document.createElement('div');
    it('class操作', () => {
        $dom.className = 'test';
        expect(js_utils_dom_has_class($dom, 'test')).toBeTruthy();
        js_utils_dom_remove_class($dom, 'test');
        expect(js_utils_dom_has_class($dom, 'test')).toBeFalsy();
        js_utils_dom_add_class($dom, 'add-class');
        expect(js_utils_dom_has_class($dom, 'add-class')).toBeTruthy();
    });
    // it('水印正常生成', () => {
    //     console.log(1);
    //     js_utils_html_to_canvas($dom, {
    //         width: 100,
    //         height: 100
    //     }).then(($canvas) => {
    //         expect($canvas.toDataURL('image/jpg').includes('data:image')).toBeTruthy();
    //     });
    // });
    it('updateCSSVariables should update CSS variables in :root selector', () => {
        // 模拟初始的内联样式表内容
        const initialStyleContent = ':root { --primaryColor: red; }';
        document.head.innerHTML = `<style id="custom-styles">${initialStyleContent}</style>`;

        // 要更新的CSS变量和它们的新值
        const updatedVariables = {
            fontSize: '16px',
            primaryColor: 'blue',
            secondaryColor: 'green',
        };

        // 调用函数来更新CSS变量
        js_utils_update_css_variables(updatedVariables, 'custom-styles');

        // 获取更新后的样式内容
        const styleElement = document.querySelector('#custom-styles');
        const updatedStyleContent = styleElement ? styleElement.textContent : '';

        // 检查更新后的样式内容是否包含正确的更新值
        expect(updatedStyleContent?.includes('primaryColor: blue;') && updatedStyleContent?.includes('secondaryColor: green;') && updatedStyleContent?.includes('fontSize: 16px;')).toBe(true);
    });
});
