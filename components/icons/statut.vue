<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
    <span class="w-4 h-4 text-center hover:bg-secondary dark:hover:bg-dark-foreground">
        <User v-if="statut === 'self'"/>
        <Users  v-if="statut === 'shared'"/>
        <Building  v-if="statut =='work'"/>
    </span>
      </TooltipTrigger>
      <TooltipContent>
        <p>
      {{
        statut === "self"
          ? $t('access_you')
          : statut === "shared"
          ? $t('access_shared')
          : statut === "work"
          ? $t('access_company')
          : ''
      }}
      </p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
  </template>
  
  <script lang="ts">
  export default {
    props: {
      statut: {
        type: String,
        required: true
      }
    }
  };
  </script>

  <script setup lang="ts">
import { User, Users, Building } from 'lucide-vue-next';
</script>