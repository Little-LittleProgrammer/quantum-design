
import { defineStore } from 'pinia';

export const useGlobalData = defineStore('global-data', {
    state: () => ({
        systemInfo: {},
        headerInfo: {}
    }),
    actions: {
        set_system_info(info) {
            console.log('--systeminfo', info);
            this.systemInfo = info;
        },
        set_header_info() {
            const menuInfo = uni.getMenuButtonBoundingClientRect();
            const info = {};
            info.totalHeight = menuInfo.top + menuInfo.height;
            info.leftGap = this.systemInfo.windowWidth - menuInfo.right;
            info.titleWidth = menuInfo.left - info.leftGap - menuInfo.width;
            const radio = this.systemInfo.screenWidth / 375;
            info.threePointRight = (menuInfo.width / 4) * 3 + info.leftGap - 22 * radio;
            info.top = menuInfo.top;
            info.left = menuInfo.left;
            info.height = menuInfo.height;
            info.leftWidth = menuInfo.width;
            console.log('--headerinfo', info);
            this.headerInfo = info;
        }
    }
});
