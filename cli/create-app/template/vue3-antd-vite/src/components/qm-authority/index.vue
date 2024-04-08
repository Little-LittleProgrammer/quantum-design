<!--
 Access control component for fine-grained access control.
-->
<script lang="ts">
import { usePermission } from '@/hooks/settings/use-permission';
import { useSlots } from '@quantum-design/hooks/vue/use-slots';
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Authority',
    props: {
        /**
         * 权限标识
         * @default ''
         */
        value: {
            type: [Number, Array, String] as PropType<string | string[]>,
            default: ''
        }
    },
    setup(props, { slots }) {
        const { hasPermission } = usePermission();
        const { getSlot } = useSlots();

        function renderAuth() {
            const { value } = props;
            if (!value) {
                return getSlot(slots);
            }
            return hasPermission(value) ? getSlot(slots) : null;
        }

        return () => {
            return renderAuth();
        };
    }
});
</script>
