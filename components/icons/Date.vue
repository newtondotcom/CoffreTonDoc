<template>
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger as-child>
                <Button variant="ghost">
                    {{
                        formatDistanceToNow(new Date(date), {
                            addSuffix: true,
                            locale: locales[locale],
                        })
                    }}
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
    import { enUS, fr, de, ja } from 'date-fns/locale';
    const locales = {
        en: enUS,
        fr: fr,
        de: de,
        ja: ja,
    };
</script>
