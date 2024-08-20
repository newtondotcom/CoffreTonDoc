<template>
    <Select v-model="value" id="locale">
        <SelectTrigger class="w-[80px] bg-secondary">
            <SelectValue placeholder="🌎" />
        </SelectTrigger>
        <SelectContent>
            <SelectItem @click="setLocale('en')" value="🇺🇸">🇺🇸</SelectItem>
            <SelectItem @click="setLocale('fr')" value="🇲🇫">🇲🇫</SelectItem>
            <SelectItem @click="setLocale('es')" value="🇪🇦">🇪🇦</SelectItem>
        </SelectContent>
    </Select>
</template>

<script setup lang="ts">
    const { setLocale } = useI18n();
    const value = ref('🇺🇸');

    watch(value, () => {
        if (value.value === '🇺🇸') {
            setLocale('en');
        } else if (value.value === '🇲🇫') {
            setLocale('fr-FR');
        } else if (value.value === '🇪🇦') {
            setLocale('es');
        }
    });
</script>
