<template>
    <Modal
        :keyboard="closeOnPressEscape"
        :mask="mask"
        ref="contentRef"
        :wrapClassName="`${componentModalClass}`"
        :destroyOnClose="destroyOnClose"
        :closable="closable"
        :class="[
            'modal-content',
            modalClass,
            uniqueClass,
            {
                'modal-content--bordered': bordered,
                'modal-content--shadow': !bordered,
                'modal-content--fullscreen': shouldFullscreen,
                'modal-content--centered': centered && !shouldFullscreen,
                'modal-content--no-transition': !dragging,
            },
        ]"
        :open="state?.isOpen"
        :z-index="zIndex"
        :maskClosable="maskClosable"
        @cancel="() => modalApi?.onCancel()"
    >
        <template #title>
            <div
                ref="headerRef"
                :class="[
                    'modal-header',
                    {
                        'modal-header--bordered': bordered,
                        'modal-header--hidden': !header,
                        'modal-header--draggable': shouldDraggable,
                    },
                    headerClass,
                ]"
            >
                <div v-if="title" class="modal-title">
                    <slot name="title">
                        {{ title }}
                        <slot v-if="titleTooltip" name="titleTooltip">
                            <Tooltip :title="titleTooltip">
                                <QuestionCircleOutlined class="modal-tooltip" />
                            </Tooltip>
                        </slot>
                    </slot>
                </div>
                <div v-if="description">
                    <slot name="description">
                        {{ description }}
                    </slot>
                </div>
                <div v-if="!title || !description">
                    <div v-if="!title" />
                    <div v-if="!description" />
                </div>
            </div>
        </template>
        <div
            ref="wrapperRef"
            :class="[
                'modal-wrapper',
                contentClass,
                {
                    'modal-wrapper--overflow-hidden': showLoading || submitting,
                },
            ]"
        >
            <!-- <VbenLoading v-if="showLoading || submitting" class="modal-loading" spinning /> -->
            <slot></slot>
        </div>
        <a-button v-if="fullscreenButton" type="text" :icon="fullscreen ? h(FullscreenExitOutlined) : h(FullscreenOutlined)" class="modal-fullscreen-btn" @click="handleFullscreen"> </a-button>
        <template #footer>
            <div
                v-if="showFooter"
                ref="footerRef"
                :class="[
                    'modal-footer',
                    {
                        'modal-footer--bordered': bordered,
                    },
                    footerClass,
                ]"
            >
                <slot name="prepend-footer"></slot>
                <a-button v-if="showCancelButton" :disabled="submitting" @click="() => modalApi?.onCancel()">
                    {{ cancelText || '取消' }}
                </a-button>
                <a-button type="primary" v-if="showConfirmButton" :disabled="confirmDisabled" :loading="confirmLoading || submitting" @click="() => modalApi?.onConfirm()">
                    {{ okText || '确认' }}
                </a-button>
                <slot name="append-footer"></slot>
            </div>
        </template>
        <template #modalRender="{ originVNode }">
            <div class="modal-content-main" ref="contentRef">
                <component :is="originVNode" />
            </div>
        </template>
    </Modal>
</template>

<script lang="ts" setup>
defineOptions({
    name: 'QAntdModal'
});
import { h, onBeforeUnmount } from 'vue';
import { Modal, Tooltip } from 'ant-design-vue';
import type { ExtendedModalApi, ModalProps } from './types/modal';
import { FullscreenExitOutlined, FullscreenOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue';

import { computed, nextTick, provide, ref, watch } from 'vue';

import { usePriorityValues } from '@quantum-design/hooks/vue/use-priority-value';
import { ELEMENT_ID_MAIN_CONTENT } from '@quantum-design/shared/enums';

import { useModalDraggable } from './hooks/use-modal-draggable';

interface Props extends ModalProps {
    modalApi?: ExtendedModalApi;
}

const props = withDefaults(defineProps<Props>(), {
    appendToMain: false,
    modalApi: undefined
});

const contentRef = ref();
const wrapperRef = ref<HTMLElement>();
const dialogRef = ref();
const headerRef = ref();
const footerRef = ref();

const id = props.modalApi?.id;
const componentModalClass = 'q-antd-modal';
const uniqueClass = `${componentModalClass}-${id}`;

provide('DISMISSABLE_MODAL_ID', id);
const state = computed(() => props.modalApi?.useStore()?.getState);
const {
    appendToMain,
    bordered,
    closeOnPressEscape,
    cancelText,
    centered,
    class: modalClass,
    closable,
    maskClosable,
    confirmDisabled,
    confirmLoading,
    okText,
    contentClass,
    description,
    draggable,
    footer: showFooter,
    footerClass, fullscreen,
    fullscreenButton, header,
    headerClass,
    loading: showLoading,
    mask, showCancelButton,
    showConfirmButton,
    submitting,
    title,
    titleTooltip,
    zIndex,
    destroyOnClose
} = usePriorityValues(props, state);

const shouldFullscreen = computed(() => fullscreen.value && header.value);

const shouldDraggable = computed(() => draggable.value && !shouldFullscreen.value && header.value);

const { dragging, transform } = useModalDraggable(dialogRef, headerRef, shouldDraggable);

watch(
    () => state?.value?.isOpen,
    async(v) => {
        if (v) {
            await nextTick();
            if (!contentRef.value) return;
            if (contentRef.value.$el) {
                await new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(true);
                    }, 100);
                });
            }
            const innerContentRef = contentRef.value;
            dialogRef.value = innerContentRef;
            const { offsetX, offsetY } = transform;
            dialogRef.value.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        }
    }
);

watch(
    () => [showLoading.value, submitting.value],
    ([l, s]) => {
        if ((s || l) && wrapperRef.value) {
            wrapperRef.value.scrollTo({
                // behavior: 'smooth',
                top: 0
            });
        }
    }
);

function handleFullscreen() {
    console.log('getAppendTo', getAppendTo.value);
    props.modalApi?.setState({
        fullscreen: !fullscreen.value
    });
}

const getAppendTo = computed(() => {
    return appendToMain.value ? `#${ELEMENT_ID_MAIN_CONTENT}>div:not(.absolute)>div` : undefined;
});

onBeforeUnmount(() => {
    props.modalApi?.useStore()?.dispose();
});
</script>
<style lang="scss">
.q-antd-modal {
    .modal-content {
        max-height: 80%;
        position: fixed;
        top: 10vh;
        margin: 0 auto;
        left: 0;
        right: 0;
        div:first-child[tabindex='0'] {
            height: 100%;
        }
        .modal-content-main {
            height: 100%;
        }
        .ant-modal-content {
            padding: 0px;
            height: 100%;
            max-height: 100%;
            display: flex;
            flex-direction: column;
            .ant-modal-header {
                .modal-header {
                    padding: 16px 20px;
                    &--bordered {
                        border-bottom: 1px solid;
                        @include border-color(border-color, bottom);
                    }
                    &--hidden {
                        display: none;
                    }
                    &--draggable {
                        cursor: move;
                        user-select: none;
                    }
                    .modal-title {
                        text-align: left;
                    }
                }
            }
            .ant-modal-body {
                flex: 1;
                overflow-y: auto;
                .modal-fullscreen-btn {
                    position: absolute;
                    right: 50px;
                    top: 20px;
                    display: none;
                    width: 14px;
                    height: 14px;
                    border-radius: 9999px;
                    padding: 0 4px;
                    font-size: 14px;
                    opacity: 0.7;
                    transition: opacity 0.2s;
                    background: transparent;
                    border: none;
                    cursor: pointer;

                    &:hover {
                        background-color: var(--accent-color);
                        color: var(--accent-foreground-color);
                        opacity: 1;
                    }

                    &:focus {
                        outline: none;
                    }

                    &:disabled {
                        pointer-events: none;
                    }

                    @media (min-width: 640px) {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                }
                .modal-wrapper {
                    position: relative;
                    min-height: 160px;
                    flex: 1;
                    overflow-y: auto;
                    padding: 0px 12px;

                    &--overflow-hidden {
                        overflow: hidden;
                    }
                }
            }
        }
        @media (min-width: 640px) {
            border-radius: var(--radius);
        }

        &--bordered {
            border: 1px solid var(--border-color);
        }

        &--shadow {
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        &--fullscreen {
            left: 0;
            top: 0;
            width: 100% !important;
            height: 100% !important;
            max-height: 100% !important;
            transform: none !important;
            .modal-content-main {
                transform: none !important;
            }
        }

        &--centered {
            top: 50%;
            transform: translateY(-50%) !important;
        }

        &--no-transition {
            transition: none;
        }
    }

    .modal-loading {
        width: 100%;
        height: 100%;
        min-height: 100%;
    }

    .modal-footer {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        padding: 8px;

        &--bordered {
            border-top: 1px solid var(--border-color);
        }
    }
}
</style>
