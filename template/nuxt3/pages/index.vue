<script setup lang="ts">

definePageMeta({
    layout: 'login'
})
const route = useRoute();
const {data} = await useCustomFetch().get({
    url: '/check/env',
    params: {
        a: 1
    }
})
const globalStore = useGlobalStore()
</script>

<template>
  <div>
    <p>data: {{ data }}</p>
    <p>Current route: {{ route.path }}</p>
    <p>globalStore: {{ globalStore.systemName }}</p>
    <a href="https://nuxt.com/docs/getting-started/routing" target="_blank">Learn more about Nuxt Routing</a>
  </div>
</template>
