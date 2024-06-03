<template>
    <MenuMobile @click.native.capture="closeMenu" name="create-list">
        <MenuMobileGroup>
            <slot />
        </MenuMobileGroup>
    </MenuMobile>
</template>

<script>
import MenuMobileGroup from '@/components/provided/Mobile/MenuMobileGroup'
import MenuMobile from '@/components/provided/Mobile/MenuMobile'

export default {
    name: 'MobileContextMenu',
    components: {
        MenuMobileGroup,
        MenuMobile,
    },
    methods: {
        closeMenu() {
            events.$emit('mobile-menu:hide')
        },
    },
}
</script>
