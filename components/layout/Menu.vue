<template>
    <div class="flex h-full w-[15%] flex-col justify-between" style="height: 100vh">
        <div class="cursor-default px-6 py-4 text-2xl font-extrabold text-primary">
            CoffreTonDoc
            <div class="flex flex-col text-xs text-gray-500 dark:text-white">
                <div class="flex">{{ $t('made_in') }}</div>
                <div class="flex">{{ $t('hosted_in') }}</div>
            </div>
        </div>
        <div
            :data-collapsed="isCollapsed"
            class="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
        >
            <nav
                class="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2"
            >
                <template v-for="(link, index) of links">
                    <div v-if="isCollapsed">
                        <Tooltip :key="`1-${index}`" :delay-duration="0">
                            <TooltipTrigger as-child>
                                <NuxtLink
                                    :to="link.to"
                                    :class="
                                        cn(
                                            link.to === path &&
                                                buttonVariants({
                                                    variant: 'default',
                                                    size: 'icon',
                                                }),
                                            link.to !== path &&
                                                buttonVariants({ variant: 'ghost', size: 'icon' }),
                                            'h-9 w-9',
                                            link.to === path &&
                                                'dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white',
                                        )
                                    "
                                >
                                    <Icon :icon="link.icon" class="size-4" />
                                    <span class="sr-only">{{ link.title }}</span>
                                </NuxtLink>
                            </TooltipTrigger>
                            <TooltipContent side="right" class="flex items-center gap-4">
                                {{ link.title }}
                            </TooltipContent>
                        </Tooltip>
                    </div>

                    <div v-else :key="`2-${index}`">
                        <NuxtLink
                            :key="`2-${index}`"
                            :to="link.to"
                            :class="
                                cn(
                                    link.to === path && buttonVariants({ variant: 'default' }),
                                    link.to !== path && buttonVariants({ variant: 'ghost' }),
                                    link.to === path &&
                                        'dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white',
                                    'w-full justify-start',
                                )
                            "
                        >
                            <Icon :icon="link.icon" class="mr-2 size-4" />
                            {{ link.title }}
                        </NuxtLink>
                    </div>
                </template>
            </nav>
        </div>
        <div class="flex w-full flex-row justify-between px-4">
            <ButtonColorMode />
            <ButtonLocale />
        </div>
        <LayoutHi />
    </div>
</template>

<script lang="ts" setup>
    import { Icon } from '@iconify/vue';
    import { cn } from '@/lib/utils';
    import { buttonVariants } from '@/components/ui/button';
    const route = useRoute();
    const path = ref(route.path);

    watch(
        route,
        () => {
            path.value = route.path;
        },
        { immediate: true },
    );

    const isCollapsed = ref(false);

    const links = [
        { title: 'My files', icon: 'iconamoon:home', label: '2', to: '/platform' },
        { title: 'Account', icon: 'iconamoon:settings', label: '1', to: '/account' },
    ];
</script>
