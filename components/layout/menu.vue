<template>
<div class="w-[15%] h-full flex flex-col justify-between bg-secondary" style="height:100vh">
    <div class="text-2xl font-extrabold px-6 py-4 text-primary">VautDoc
    <div class="text-xs text-gray-500 dark:text-white"> {{ $t('made_france')}}</div>
    </div> 
    <LayoutLinks />
    <div class="flex flex-row w-full justify-between px-4">
        <ButtonColorMode />
        <ButtonLocale />
    </div>
    <LayoutHi />
</div>
</template>
