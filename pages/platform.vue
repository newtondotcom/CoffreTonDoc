<template>
    <div class="lg:flex h-screen lg:overflow-hidden w-full">
        <!--On Top of App Components-->
        <FilePreview />
        <Spotlight />

        <!--Popups-->
        <ProcessingPopup />
        <ConfirmPopup />

        <CreateTeamFolderPopup />
        <EditTeamFolderPopup />

        <ShareCreatePopup />
        <ShareEditPopup />

        <CreateUploadRequestPopup />
		<NotificationsPopup />
		<RemoteUploadPopup />
        <CreateFolderPopup />
        <RenameItemPopup />
        <MoveItemPopup />

        <!--Mobile components-->
        <ProvidedMenusFileSortingMobile />
        <FileFilterMobile />

        <!--Navigations-->
        <MobileNavigation />

        <!--Others-->
        <DragUI />

        <!--2 col Sidebars-->
        <PanelNavigationFiles />

        <div
            @contextmenu.prevent.capture="contextMenu($event, undefined)"
            class="lg:flex lg:flex-col lg:w-full lg:px-3.5 min-w-0"
        >
            <DesktopToolbar />

            <MobileToolbar />

            <!--Google Adsense banner-->
            <div v-if="config.allowedAdsense && config.adsenseBanner01" v-html="config.adsenseBanner01" class="mb-5 min-h-[120px]"></div>

            <!--File list & info sidebar-->
            <div class="flex space-x-3 lg:overflow-hidden grow" @drop.stop.prevent="uploadDroppedItems($event)" @dragenter.prevent @dragover.prevent>
                <router-view id="file-view" class="relative w-full min-w-0" :key="$route.fullPath" />

                <InfoSidebar v-if="isVisibleSidebar" />
            </div>
        </div>
    </div>
</template>

<script>
import { getFilesFromDataTransferItems } from 'datatransfer-files-promise'
import FileSortingMobile from '@/components/provided/Menus/FileSortingMobile'
import SidebarNavigation from '@/components/provided/Sidebar/SidebarNavigation'
import FileFilterMobile from '@/components/provided/Menus/FileFilterMobile'
import CreateFolderPopup from '@/components/provided/Popups/CreateFolderPopup'
import ProcessingPopup from '@/components/provided/Popups/ProcessingPopup'
import MobileNavigation from '@/components/provided/Mobile/MobileNavigation'
import ShareCreatePopup from '@/components/provided/Popups/ShareCreatePopup'
import DesktopToolbar from '@/components/provided/Layout/Toolbars/DesktopToolbar'
import CreateTeamFolderPopup from '@/components/provided/Teams/CreateTeamFolderPopup'
import ConfirmPopup from '@/components/provided/Popups/ConfirmPopup'
import RenameItemPopup from '@/components/provided/Popups/RenameItemPopup'
import PanelNavigationFiles from '@/components/provided/EntriesView/PanelNavigationFiles'
import MobileToolbar from '@/components/provided/Layout/Toolbars/MobileToolbar'
import ShareEditPopup from '@/components/provided/Popups/ShareEditPopup'
import FilePreview from '@/components/provided/FilePreview/FilePreview'
import MoveItemPopup from '@/components/provided/Popups/MoveItemPopup'
import EditTeamFolderPopup from '@/components/provided/Teams/EditTeamFolderPopup'
import Spotlight from '@/components/provided/Spotlight/Spotlight'
import DragUI from '@/components/provided/UI/Others/DragUI'
import InfoSidebar from '@/components/provided/Layout/Sidebars/InfoSidebar'
import { mapGetters } from 'vuex'
import CreateUploadRequestPopup from "@/components/provided/UploadRequest/CreateUploadRequestPopup";
import NotificationsPopup from "@/components/provided/Notifications/NotificationsPopup";
import RemoteUploadPopup from "@/components/provided/RemoteUpload/RemoteUploadPopup";

export default {
    name: 'Platform',
    components: {
		RemoteUploadPopup,
		NotificationsPopup,
		CreateUploadRequestPopup,
        CreateTeamFolderPopup,
        PanelNavigationFiles,
        EditTeamFolderPopup,
        CreateFolderPopup,
        FileSortingMobile,
        SidebarNavigation,
        FileFilterMobile,
        MobileNavigation,
        ShareCreatePopup,
        ProcessingPopup,
        RenameItemPopup,
        ShareEditPopup,
        DesktopToolbar,
        MoveItemPopup,
        MobileToolbar,
        ConfirmPopup,
        InfoSidebar,
        FilePreview,
        Spotlight,
        DragUI,
    },
    computed: {
        ...mapGetters(['isVisibleSidebar', 'config', 'currentFolder']),
    },
    data() {
        return {
            isScaledDown: false,
        }
    },
    methods: {
		async uploadDroppedItems(event) {
			// Check if user dropped folder with files
			let files = await getFilesFromDataTransferItems(event.dataTransfer.items)

			if (files.length !== 0) {
				// Upload folder with files
				this.$uploadDraggedFolderOrFile(files, this.currentFolder?.data.id)
			}
		},
        contextMenu(event, item) {
//            events.$emit('context-menu:show', event, item)
        },
    },
    mounted() {
        // TODO: new scaledown effect
//        events.$on('mobile-menu:show', () => (this.isScaledDown = true))
//        events.$on('mobile-menu:hide', () => (this.isScaledDown = false))
    },
}
</script>
