<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <span class="w-5 hover:bg-secondary dark:hover:bg-dark-foreground flex justify-center items-center">
          <User v-if="statut === 'USER'" />
          <Users v-if="statut === 'SHARED'" />
          <Building v-if="statut === 'COMPANY'" />
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p>
          {{
            statut === "USER"
              ? $t('access_you')
              : statut === "SHARED"
              ? $t('access_shared')
              : statut === "COMPANY"
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
    required: true
  },
});
</script>
