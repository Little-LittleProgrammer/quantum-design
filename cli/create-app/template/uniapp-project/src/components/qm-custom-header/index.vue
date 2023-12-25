<template>
    <view :class="headerClass" class="qm-custom-header-wrap">
        <view class="qm-custom-header flex-start-center" :style="{
          paddingTop: headerInfo.top + 'px',
          height: headerInfo.totalHeight + 'px',
        }">
            <slot name="header">
                <view class="header-left"
                    :style="{width: headerInfo.leftWidth + 'px', paddingLeft: headerInfo.leftGap + 'px'}"
                    @click="on_back">
                    <slot name="headerLeft">
                        <view class="header-left_icon" v-if="!isTab"
                            :class="isFirstPage ? 'home-icon' : theme === 'dark' ? 'back-icon' : 'back-icon_white'">
                        </view>
                    </slot>
                </view>
                <view class="header-title flex-center-center" :style="{width: headerInfo.titleWidth + 'px'}">
                    <slot name="headerTitle">
                        {{ props.title }}
                    </slot>
                </view>
            </slot>
        </view>
        <view v-if="props.placeholder" class="qm-custom-header-placeholder"
            :style="{height: headerInfo.totalHeight + 'px'}"></view>
    </view>

</template>
<script setup>
import { ref } from 'vue';
import { useGlobalData } from '../../store/global-data';

const props = defineProps({
    title: { // 标题
        type: String,
        default: '短剧'
    },
    placeholder: { // 高度占位
        type: Boolean,
        default: true
    },
    isTab: { // 是否为导航页
        type: Boolean,
        default: false
    },
    headerClass: {
        type: String,
        default: ''
    }
});
const $emit = defineEmits(['back']);

const globalData = useGlobalData();
const { headerInfo } = globalData;

const pageArr = getCurrentPages(); // eslint-disable-line
const isFirstPage = ref(pageArr.length === 1);

const on_back = () => {
    if (props.isTab) return;
    $emit('back');
    if (isFirstPage) {
        uni.switchTab({
            url: `/pages/index/index`
        });
    } else {
        uni.navigateBack();
    }
};
</script>
<style lang="less">
.qm-custom-header {
    position: fixed;
    z-index: 999;
    top: 0;
    left: 0;
    width: 100vw;
    background-color: #fff;

    .header-left {
        height: 100%;
        display: flex;
        align-items: center;

        &_icon {
            width: 48rpx;
            height: 48rpx;
            background-repeat: no-repeat;
            background-size: 100% 100%;
        }

        .home-icon {
            background-image: url('./home-icon.png');
        }

        .back-icon {
            background-image: url('./back-icon.png');
        }

        .back-icon_white {
            background-image: url('./back-icon-white.png');
        }
    }

    .header-title {
        font-size: 34rpx;
        text-align: center;
        // @include text-ellipsis(1)
    }
}
</style>
