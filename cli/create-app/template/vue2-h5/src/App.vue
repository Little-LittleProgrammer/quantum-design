<template>
    <div id="app">
        <div class="wrapper">
            <router-view @eventStatistic="bind_data_event_statistic" v-if="routeRefresh"></router-view>
        </div>
        <loading-page :show.sync="$store.state.loadingPageStatus"></loading-page>

        <!--提示框-->
        <toast :isShow="$store.state.toast.isShow" :params="$store.state.toast.params" @update:isShow="$store.commit('TOAST_HIDE')"></toast>
        <!--提示框-->

    </div>
</template>
<script>
    import loadingPage from '@components/loading-page';
    import freePop from '@components/pop';
    import toast from '@components/toast';

    import tools from '@common/tools'

    export default {
        data() {
            return {
              routeRefresh: 1
            }
        },
      watch: {
        '$route'(to, from) {
          if (to.path === '/app-h5/freebook/vip-android' && from.path === '/app-h5/freebook/recharge-result') {
            this.routeRefresh = 0;
            this.$nextTick(() => {
              this.routeRefresh = 1;
            })
          }else{
            window.scrollTo(0,0);
          }
        },
      },
        mounted() {


        },
        computed: {},
        components: {
            loadingPage,
            freePop,
            toast,
            tools
        },
        methods: {
            bind_data_event_statistic(obj){
                let el = event.currentTarget;
                tools.send_event_statistic(el);
            }
        }
    }
</script>
<style lang="scss">
  @import "~@style/mixin.scss";
  @import "~@style/base.scss";
</style>
