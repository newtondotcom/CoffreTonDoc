<template>
    <MenuMobile name="team-menu">
        <TeamFolderPreview />

        <MenuMobileGroup v-if="$slots.default">
            <slot />
        </MenuMobileGroup>
    </MenuMobile>
</template>

<script>
import MenuMobileGroup from '@/components/provided/Mobile/MenuMobileGroup'
import TeamFolderPreview from '@/components/provided/Teams/Components/TeamFolderPreview'
import MenuMobile from '@/components/provided/Mobile/MenuMobile'

export default {
    name: 'MobileTeamContextMenu',
    components: {
        TeamFolderPreview,
        MenuMobileGroup,
        MenuMobile,
    },
}
</script>
