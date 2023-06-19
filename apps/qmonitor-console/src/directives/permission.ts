/**
 * 权限指令, 'btn1'为此按钮的权限值
 * @Example v-permission="'btn1'"
 */
import { usePermission } from '@/hooks/settings/use-permission';
import type { App, Directive, DirectiveBinding } from 'vue';

function is_auth(el: Element, binding: any) {
    const { hasPermission } = usePermission();

    const value = binding.value;
    if (!value) return;
    if (!hasPermission(value)) {
        el.parentNode?.removeChild(el);
    }
}

const permissionDirective: Directive = {
    mounted: (el: Element, binding: DirectiveBinding<any>) => {
        is_auth(el, binding);
    }
};

export function setup_permission_directive(app: App) {
    app.directive('permission', permissionDirective);
}

export default permissionDirective;

