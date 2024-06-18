<template>
  <Select>
    <SelectTrigger class="w-[80px] bg-secondary">
      <SelectValue placeholder="🌎" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem @click="setLocale('en')" value="🇺🇸"> 🇺🇸 </SelectItem>
      <SelectItem @click="setLocale('fr')" value="🇲🇫"> 🇲🇫 </SelectItem>
      <SelectItem @click="setLocale('es')" value="🇪🇦"> 🇪🇦 </SelectItem>
    </SelectContent>
  </Select>
</template>

<script setup lang="ts">
const { locale, setLocale } = useI18n();
</script>
