<template>
    <div class="qmError">
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="90" height="90" fill="#DBE1EC" viewBox="0 0 48 48" class="icon">
                <path d="M22 30h4v4h-4zm0-16h4v12h-4zm1.99-10C12.94 4 4 12.95 4 24s8.94 20 19.99 20S44 35.05 44 24 35.04 4 23.99 4zM24 40c-8.84 0-16-7.16-16-16S15.16 8 24 8s16 7.16 16 16-7.16 16-16 16z"></path>
            </svg>
            <div class="title">This page could not be found</div>
        </div>
    </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
.qmError {
    .icon{
        margin: 0 auto;
        display: block;
    }
    display: flex;
    align-content: center;
    justify-content: center;
}
</style>
