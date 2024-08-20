<template>
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger as-child>
                <Button variant="ghost">
                    {{ formatDistanceToNow(new Date(date), { addSuffix: true }) }}
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>{{ new Date(date).toLocaleDateString() }}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
</template>

<script setup lang="ts">
    interface DateProps {
        date: String;
    }
    const props = defineProps<DateProps>();
    const { locale } = useI18n();

    import { formatDistanceToNow } from 'date-fns';
</script>
