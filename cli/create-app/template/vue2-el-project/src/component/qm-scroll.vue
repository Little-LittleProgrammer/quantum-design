<template>
    <div ref="wrapper">
        <slot></slot>
    </div>
</template>
<script>
    import BScroll from 'better-scroll'
    export default {
        props: {
            /**
             *  1 滚动的时候会派发scroll事件，会截流。
             *  2 滚动的时候实时派发scroll事件，不会截流。
             *  3 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
             **/
            probeType: { type: Number, default: 1 },
            /** * 点击列表是否派发click事件 */
            click: { type: Boolean, default: true },
            /** * 是否开启横向滚动 */
            scrollX: { type: Boolean, default: false },
            /** * 是否开启纵向滚动*/
            scrollY: { type: Boolean, default: true },
            /** * 是否派发滚动事件 */
            listenScroll: { type: Boolean, default: false },
            /** * 列表的数据 */
            data: { type: [Array, Boolean, Number, String], default: null },
            /** * 是否派发滚动到底部的事件，用于上拉加载 */
            pullup: { type: Boolean, default: false },
            /** * 是否派发顶部下拉的事件，用于下拉刷新 */
            pulldown: { type: Boolean, default: false },
            /** * 是否派发列表滚动开始的事件 */
            beforeScroll: { type: Boolean, default: false },
            /** * 当数据更新后，刷新scroll的延时 */
            refreshDelay: { type: Number, default: 30 },
            momentum: { type: Boolean, default: true },
            /** * 设置边缘回弹 */
            bounce: {
                type: Object, default: () => {
                    return { top: true, bottom: true, left: true, right: true }
                }
            },
            /** * 是否阻止事件冒泡 */
            stopPropagation: { type: Boolean, default: false},
            snap: { type: Object, default: undefined },
            /** * 是否开启自动轮播 */
            autoPlay: { type: Boolean, default: false },
            /** * 自动轮播间隔时间*/
            interval: { type: Number, default: 4000 }
        },
        mounted() { // 保证在DOM渲染完毕后初始化better-scroll

            setTimeout(() => {
                if (this.scrollX) {
                    // this.setSliderWidth()
                }
                this._initScroll()
                if (this.autoPlay) {
                    this.play()
                }
            }, 20)
        },
        data() {
            return {
                dots: [],
                currentPageIndex: 0
            }
        },
        methods: {
            _initScroll() {
                if (!this.$refs.wrapper) {
                    return
                } // better-scroll的初始化
                this.scroll = new BScroll(this.$refs.wrapper, {
                    probeType: this.probeType,
                    click: this.click,
                    scrollX: this.scrollX,
                    scrollY: this.scrollY,
                    momentum: this.momentum,
                    snap: this.snap,
                    bounce: this.bounce,
                    stopPropagation: this.stopPropagation,

                }) // 是否派发滚动事件
                if (this.listenScroll) {
                    let me = this
                    this.scroll.on('scroll', (pos) => {
                        me.$emit('scroll', pos)
                    })
                } // 是否派发滚动到底部事件，用于上拉加载
                if (this.pullup) {
                    this.scroll.on('scrollEnd', () => { // 滚动到底部
                        if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
                            this.$emit('scrollToEnd')
                        }
                    })
                } // 是否派发顶部下拉事件，用于下拉刷新
                if (this.pulldown) {
                    this.scroll.on('touchEnd', (pos) => { // 下拉动作
                        if (pos.y > 50) {
                            this.$emit('pulldown')
                        }
                        if(pos.y >= 0){
                            this.$emit('scrollToStart')
                        }
                    })
                } // 是否派发列表滚动开始的事件
                if (this.beforeScroll) {
                    this.scroll.on('beforeScrollStart', () => {
                        this.$emit('beforeScroll')
                    })
                }
                if (this.snap && this.snap.loop) {
                    this.scroll.on('scrollEnd', () => {
                        this.currentPageIndex = this.scroll.getCurrentPage().pageX
                        if (this.autoPlay) {
                            this.play()
                        }
                    })
                    this.scroll.on('beforeScrollStart', () => {
                        if (this.autoPlay) {
                            clearTimeout(this.timer)
                        }
                    })
                }
            },
            disable() { // 代理better-scroll的disable方法
                this.scroll && this.scroll.disable()
            },
            enable() { // 代理better-scroll的enable方法
                this.scroll && this.scroll.enable()
            },
            refresh() { // 代理better-scroll的refresh方法
                this.scroll && this.scroll.refresh()
            },
            destroy() { // 代理better-scroll的destroy方法
                this.scroll && this.scroll.destroy()
            },
            stop() { // 代理better-scroll的stop方法
                this.scroll && this.scroll.stop()
            },
            on() { // 代理better-scroll的on方法
                this.scroll && this.scroll.on()
            },
            scrollTo() { // 代理better-scroll的scrollTo方法
                this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
            },
            scrollToElement() { // 代理better-scroll的scrollToElement方法
                this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
            },
            play() {   // 自动轮播
                this.timer = setTimeout(() => {
                    this.scroll.next()
                }, this.interval)
            },
            setSliderWidth() {
                this.children = this.$refs.wrapper.children[0].children[0];
                // this.dots = new Array(this.children.length)
                let sliderWidth = this.children.clientWidth;
                // for (let i = 0; i < this.children.length; i++) {
                //     width += sliderWidth
                // }
                let width = sliderWidth;
                if (this.snap && this.snap.loop) {
                    width += 2 * sliderWidth
                }
                this.$refs.wrapper.children[0].style.width = width + 'px'
            }
        },
        watch: { // 监听数据的变化，延时refreshDelay时间后调用refresh方法重新计算，保证滚动效果正常
            data() {
                setTimeout(() => {
                    this.refresh()
                }, this.refreshDelay)
            },

        }
    }
</script>
<style scoped lang="scss">
</style>
