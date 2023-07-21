import QLoading from '../src/q-loading';
import { mount } from '@vue/test-utils';
import { nextTick, ref } from 'vue';
import {expect, test, vi, describe} from 'vitest';

describe('q-loading', () => {
    test('create loading', async() => {
        const loading = ref(true);
        const wrapper = mount(() => <QLoading loading={loading.value}></QLoading>);
        await nextTick();
        const maskWrapper = wrapper.find('.mask');
        expect(maskWrapper.exists()).toBeTruthy();

        vi.useFakeTimers();
        loading.value = false;
        // Trigger update event for dispatching close event.
        await nextTick();

        vi.runAllTimers();
        vi.useRealTimers();
        await nextTick();
        expect(wrapper.find('.mask').exists()).toBeFalsy();
    });
});
