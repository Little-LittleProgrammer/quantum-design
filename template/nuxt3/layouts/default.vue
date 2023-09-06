<template>
    <div>
        <a-config-provider :theme="theme" :locale="zhCN">
            <div class="container">
                <div>
                    <a-space>
                        <a-button @click="changeTheme('dark')">
                        dark
                        </a-button>
                        <a-button @click="changeTheme('light')">
                        light
                        </a-button>
                    </a-space>
                </div>
                <slot />
            </div>
        </a-config-provider>
    </div>
  </template>
  
<script setup lang="ts">
import { theme as antdTheme } from "ant-design-vue"
import { reactive } from "#imports";
import zhCN from 'ant-design-vue/es/locale/zh_CN';

const appConfig = useRuntimeConfig()
const theme = reactive({
    algorithm: appConfig.public.globalThemeConfig.algorithm,
    token: appConfig.public.globalThemeConfig.token
})

const color = reactive({
    bg:"#fff",
    color:"#000"
})
const changeTheme = (type:'dark' | 'light') => {
    if(type === 'dark'){
        theme.algorithm = antdTheme.darkAlgorithm
        color.bg = "#000"
        color.color = "#fff"
    }else{
        theme.algorithm = antdTheme.compactAlgorithm
        color.bg = "#fff"
        color.color = "#000"
    }
}


</script>
  
  <style>
  *{
   margin: 0;
   padding: 0;
  }
  .container{
    padding: 10px;
    display: flex;
    overflow-x: hidden;
    overflow-y: auto;
    flex-direction: column;
    gap: 10px;
    height: 100vh;
    width: 100vw;
    background-color: v-bind("color.bg");
    color: v-bind("color.color");
  }
  
  </style>