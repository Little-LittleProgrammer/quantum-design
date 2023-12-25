<template>
  <div class="wrapper">
    <qm-header :visible="visible" />
    <nuxt />
  </div>
</template>
<script>
import { js_tools_throttle } from '@/assets/js/tools';
import qmHeader from '@/components/qm-header.vue';
export default {
    components: {
        qmHeader
    },
    data () {
        return {
            visible: false,
            visibilityHeight: 100
        };
    },
    mounted () {
        this.init();
    },
    beforeDestroy () {
        window.removeEventListener('scroll', this.scroll);
    },
    methods: {
        init () {
            window.addEventListener('scroll', js_tools_throttle(this.scroll, 100));
        },
        scroll () {
            const _scrollTop =
        document.documentElement.scrollTop ||
        window.pageYOffset ||
        document.body.scrollTop;
            this.visible = _scrollTop > this.visibilityHeight;
        }
    }
};
</script>
