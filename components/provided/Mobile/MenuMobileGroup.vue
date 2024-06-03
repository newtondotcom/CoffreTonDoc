<template>
    <div class="menu-options">
        <slot />
    </div>
</template>

<script>
export default {
    name: 'MenuMobileGroup',
}
</script>

<style scoped lang="scss">
@import '@/components/sass/vuefilemanager/_variables';
@import '@/components/sass/vuefilemanager/_mixins';

.menu-options {
    margin-top: 10px;
    list-style: none;
    width: 100%;
}
</style>
