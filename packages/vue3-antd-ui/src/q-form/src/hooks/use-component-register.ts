import type { ComponentType } from '../types/index';
import { add, del } from '../component-map';
import type { Component } from 'vue';

// 自定义组件添加
export function useComponentRegister(compName: ComponentType, comp: Component) {
    add(compName, comp);
}

// 自定义组件删除
export function delComponentRegister(compName: ComponentType) {
    del(compName);
}
