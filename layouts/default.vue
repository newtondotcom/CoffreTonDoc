<template>
    <div class="flex flex-row">
        <TooltipProvider :delay-duration="0">
            <ResizablePanelGroup
                id="resize-panel-group-1"
                direction="horizontal"
                class="h-full max-h-[800px] items-stretch"
            >
                <ResizablePanel
                    id="resize-panel-1"
                    :default-size="defaultLayout[0]"
                    :collapsed-size="navCollapsedSize"
                    collapsible
                    :min-size="15"
                    :max-size="20"
                    :class="
                        cn(isCollapsed && 'min-w-[50px] transition-all duration-300 ease-in-out')
                    "
                    @expand="onExpand"
                    @collapse="onCollapse"
                >
                    <LayoutMenu :isCollapsed />
                </ResizablePanel>
                <ResizableHandle id="resize-handle-1" with-handle />
                <ResizablePanel id="resize-panel-2" :default-size="defaultLayout[1]" :min-size="30">
                    <slot />
                </ResizablePanel>
            </ResizablePanelGroup>
        </TooltipProvider>

        <div v-if="store.loading" class="absolute bottom-8 right-8">
            <div class="h-10 w-10 animate-ping rounded-full bg-violet-800"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { cn } from '@/lib/utils';
    import { useLoadingStore } from '@/stores/loading';
    const store = useLoadingStore();

    const defaultLayout = [360, 1000]; // sum must be 1360
    const isCollapsed = ref(false);
    const navCollapsedSize = 4;
    function onCollapse() {
        isCollapsed.value = true;
    }

    function onExpand() {
        isCollapsed.value = false;
    }
</script>
