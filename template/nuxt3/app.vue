<template>
    <div>
        <NuxtLoadingIndicator />
        <NuxtLayout class="layouts">
            <NuxtPage />
        </NuxtLayout>
    </div>
</template>

<style lang="scss">
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.3s;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>