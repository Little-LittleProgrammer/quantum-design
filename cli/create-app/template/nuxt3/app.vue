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
.button {
    border: 1px solid;
    height: 40px;
    width: 60px;
    border-radius: 10px;
    line-height: 40px;
    text-align: center;
}
</style>
