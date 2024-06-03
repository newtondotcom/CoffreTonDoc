<template>
    <MenuMobile name="file-sorting">
        <MenuMobileGroup>
            <FileSortingOptions />
        </MenuMobileGroup>
    </MenuMobile>
</template>

<script>
import FileSortingOptions from './FileSortingOptions'
import MenuMobileGroup from '@/components/provided/Mobile/MenuMobileGroup'
import MenuMobile from '@/components/provided/Mobile/MenuMobile'

export default {
    name: 'FileSortingMobile',
    components: {
        FileSortingOptions,
        MenuMobileGroup,
        MenuMobile,
    },
}
</script>
