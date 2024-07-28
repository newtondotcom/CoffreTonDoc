<template>
    <div class="flex h-full w-[15%] flex-col justify-between" style="height: 100vh">
        <div class="px-6 py-4 text-2xl font-extrabold text-primary">
            CoffreTonDoc
            <div class="flex flex-col text-xs text-gray-500 dark:text-white">
                <div class="flex">{{ $t('made_in') }}</div>
                <div class="flex">{{ $t('hosted_in') }}</div>
            </div>
        </div>
        <LayoutLinks />
        <div class="flex w-full flex-row justify-between px-4">
            <ButtonColorMode />
            <ButtonLocale />
        </div>
        <LayoutHi />
    </div>
</template>
