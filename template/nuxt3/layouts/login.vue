<template>
    <q-loading :loading="globalStore.pageLoading">
        <a-config-provider :theme="theme" :locale="zhCN">
            <div class="login-layout-container">
                <div class="header-container">
                    <div class="header ">
                        <img src="@/assets/image/adx_logo.png" alt="" srcset="" @click="jump_to_main_page">
                        <p @click="jump_to_sub_page">
                            业务规范
                        </p>
                    </div> 
                </div>
                <slot></slot>
            </div>
        </a-config-provider>
    </q-loading>
  </template>
  
<script setup lang="ts">
import { reactive } from "#imports";
import zhCN from 'ant-design-vue/es/locale/zh_CN';
const appConfig = useRuntimeConfig()
const router = useRouter()
const globalStore = useGlobalStore()
const theme = reactive({
    algorithm: appConfig.public.globalThemeConfig.algorithm,
    token: appConfig.public.globalThemeConfig.token
})
function jump_to_main_page() {
    router.push({
        path: '/user/login'
    })
}

function jump_to_sub_page() {
    router.push({
        path: '/sys/business-standard-no-login'
    })
}

</script>
  
<style lang="scss" scoped>
.login-layout-container{
    height: calc(100vh);
    overflow-y: auto;
    .header-container {
        box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.1);
        @media (max-width: 1100px) {
            overflow-x: hidden;
           .header {
               width: 90% !important;

               img {
                    height: 32px !important;
                }
           }
        }
        .header {
            width: 966px;
            margin: 0 auto;
            height: 72px;
            padding: 20px 0;
               display: flex;
               justify-content: space-between;
               align-items: center;
            img {
                height: 40px;
                cursor: pointer;
            }
            p {
                cursor: pointer;
                font-size: 14px;
            }
        }
    }
}
</style>