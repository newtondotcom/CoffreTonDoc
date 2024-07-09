<template>
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger as-child>
                <span
                    class="dark:hover:bg-dark-foreground flex w-5 items-center justify-center hover:bg-secondary"
                >
                    <User v-if="statut === 'USER'" />
                    <Users v-if="statut === 'SHARED'" />
                    <Building v-if="statut === 'COMPANY'" />
                </span>
            </TooltipTrigger>
            <TooltipContent>
                <p>
                    {{
                        statut === 'USER'
                            ? $t('access_you')
                            : statut === 'SHARED'
                              ? $t('access_shared')
                              : statut === 'COMPANY'
                                ? $t('access_company')
                                : ''
                    }}
                </p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
</template>

<script setup lang="ts">
import { User, Users, Building } from 'lucide-vue-next';
defineProps({
    statut: {
        type: String,
        required: true,
    },
});
</script>
