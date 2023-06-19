# 插槽

## Usage

```vue
<script lang="ts">
import { useSlots } from '@qmfront/hooks/vue';
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
        const { getSlot, extendSlots } = useSlots();

        function renderAuth() {
            const { value } = props;
            if (!value) {
                return getSlot(slots);
            }
            return  null;
        }

        return () => {
            return renderAuth();
        };
    }
});
</script>

```


## API

|  暴露      |   类型   |   说明   |
|:---------:|----------|---------|
|  getSlot  |  `(slots: Slots, slot = 'default', data?: any) => slots`  | 获取插槽以防止空错误 |
|  extendSlots  |  `(slots: Slots, excludeKeys: string[] = []) => slots`  | 排除插槽 |