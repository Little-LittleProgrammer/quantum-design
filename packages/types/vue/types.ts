import type { CSSProperties, VNodeChild, VNode } from 'vue';
import { createTypes, VueTypeValidableDef, VueTypesInterface } from 'vue-types';

export type VueNode = VNodeChild | VNode;

type PropTypes = VueTypesInterface & {
  readonly style: VueTypeValidableDef<CSSProperties>;
  readonly VNodeChild: VueTypeValidableDef<VueNode>;
  // readonly trueBool: VueTypeValidableDef<boolean>;
};

const propTypes = createTypes({
    func: undefined,
    bool: undefined,
    string: undefined,
    number: undefined,
    object: undefined,
    integer: undefined
}) as PropTypes;

propTypes.extend([
    {
        name: 'style',
        getter: true,
        type: [String, Object],
        default: undefined
    },
    {
        name: 'VNodeChild',
        getter: true,
        type: undefined
    }
]);

export { propTypes };

export interface menuData {
    auth_name: string;
    icon?: string;
    id: string;
    path: string;
    pid: string;
    children?: menuData[]
}

export interface IBreadcrumb {
    id: string;
    name: string;
    path: string;
    pid: string;
    title: string
}
