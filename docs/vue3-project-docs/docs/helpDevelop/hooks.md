# hooks

## hooks 定义
1. hooks与我们平时书写的小工具没有太多的差别,
2. hooks就是基于vue的api书写的方法, 可以被页面引用

## 例子

```js
import { policy_select_format } from '@/components/operation-module/scope/tools/policy-select-format';
import { api_get_direction_select } from '@/http/api/common/operation/direction';
import { ComputedRef, Ref, ref, watch } from 'vue';

let oldPlatform: number | null = null;
const triPolicyTargeteEnums = ref({}) as Ref<any>;
export function useDirection(props: ComputedRef<Partial<Record<'platform', any>>>) {
    watch(() => props.value.platform, async(val) => {
        if (val) {
            await init_select(val);
        }
    }, {immediate: true});
    async function init_select(val:number = 1) {
        if (oldPlatform !== val) {
            triPolicyTargeteEnums.value = {};
            const _res = await api_get_direction_select({platform: val});
            if (_res.code === 200) {
                triPolicyTargeteEnums.value = policy_select_format(_res.data);
                oldPlatform = val;
            }
        }
    }
    return {
        triPolicyTargeteEnums, init_select
    };
}

```