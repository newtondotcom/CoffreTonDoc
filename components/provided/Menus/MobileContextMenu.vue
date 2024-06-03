<template>
    <MenuMobile name="file-menu">
        <ThumbnailItem class="m-5" :item="clipboard[0]" />

        <MenuMobileGroup v-if="$slots.default">
            <slot />
        </MenuMobileGroup>

        <MenuMobileGroup v-if="$slots.editor && $checkPermission('editor')">
            <slot name="editor" />
        </MenuMobileGroup>

        <MenuMobileGroup v-if="$slots.visitor && $checkPermission('visitor')">
            <slot name="visitor" />
        </MenuMobileGroup>
    </MenuMobile>
</template>

<script>
import MenuMobileGroup from '@/components/provided/Mobile/MenuMobileGroup'
import ThumbnailItem from '@/components/provided/UI/Entries/ThumbnailItem'
import MenuMobile from '@/components/provided/Mobile/MenuMobile'
import { mapGetters } from 'vuex'

export default {
    name: 'MobileContextMenu',
    components: {
        MenuMobileGroup,
        ThumbnailItem,
        MenuMobile,
    },
    computed: {
        ...mapGetters(['clipboard']),
    },
}
</script>
