import { describe, it, expect } from 'vitest';
import { js_utils_dom_add_class, js_utils_dom_has_class, js_utils_dom_remove_class } from '../src/dom-util';

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
});
