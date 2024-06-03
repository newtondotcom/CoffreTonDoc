<template>
    <ul class="list-info">
        <slot />
    </ul>
</template>

<script>
export default {
    name: 'ListInfo',
}
</script>

<style lang="scss" scoped>
@import '@/components/sass/vuefilemanager/variables';
@import '@/components/sass/vuefilemanager/mixins';
</style>
