<script setup lang="ts">

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
  <q-loading :loading="true">
    <p>data: {{ data }}</p>
    <p>Current route: {{ route.path }}</p>
    <p>globalStore: {{ globalStore.systemName }}</p>
    <a href="https://nuxt.com/docs/getting-started/routing" target="_blank">Learn more about Nuxt Routing</a>
  </q-loading>
</template>
