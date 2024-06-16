<template>
<div class="gap-4 mt-4 mb-4 flex flex-col justify-center items-center">
    <div class="flex flex-row justify-center items-center gap-4">
        <Avatar class="hidden h-9 w-9 sm:flex">
            <AvatarImage src="/avatars/01.png" alt="Avatar" />
            <AvatarFallback>OM</AvatarFallback>
        </Avatar>
        <div class="grid gap-1">
            <p class="text-sm font-medium leading-none">
                Olivia Martin
            </p>
            <p class="text-sm text-muted-foreground">
                olivia.martin@email.com
            </p>
        </div>
        <!-- 
              <div class="ml-auto font-medium">
                +$1,999.00
              </div>
                -->
    </div>
    <Button class="w-[70%]" variant="destructive">
        Log out
    </Button>
</div>
</template>
