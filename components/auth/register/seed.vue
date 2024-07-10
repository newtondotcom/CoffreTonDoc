<template>
 <div class="flex flex-col justify-center align-middle">
  <div class="flex flex-row items-center justify-between px-1 py-2">
   <Label for="seed">{{ $t('seed_phrase') }}</Label>
   <Button
    variant="secondary"
    type="submit"
    size="sm"
    class="px-3"
    @click="copy"
   >
    <span class="sr-only">Copy</span>
    <Copy class="h-4 w-4" />
   </Button>
  </div>
  <div class="grid grid-cols-3 gap-x-2 gap-y-4">
   <div v-for="i in seed.length" :key="i" class="flex items-center space-x-2">
    <Input
     :id="'seed-' + i"
     type="text"
     class="w-[100px]"
     v-model="seed[i - 1]"
     disabled
    />
   </div>
  </div>
  <div class="my-2 grid gap-2 pb-4">
   <div class="flex flex-row items-center justify-between">
    <Label class="my-2" for="want">{{ $t('save_seed') }}</Label>
    <Switch id="want" v-model:checked="userWantToSaveSeed" />
   </div>

   <div
    v-if="userWantToSaveSeed"
    class="flex flex-row items-center justify-between"
   >
    <Label class="my-2 mr-4" for="duration">{{ $t('save_duration') }}</Label>
    <Select id="duration" v-model="userSaveSeedDuration">
     <SelectTrigger class="w-[180px]">
      <SelectValue placeholder="Select a fruit" />
     </SelectTrigger>
     <SelectContent>
      <SelectGroup>
       <SelectLabel>{{ $t('seed_duration') }}</SelectLabel>
       <SelectItem value="1"> 1 {{ $t('seed_day') }} </SelectItem>
       <SelectItem value="30"> 30 {{ $t('seed_day') }} </SelectItem>
       <SelectItem value="365"> 1 {{ $t('seed_year') }} </SelectItem>
       <SelectItem value="99*365"> 99 {{ $t('seed_year') }} </SelectItem>
      </SelectGroup>
     </SelectContent>
    </Select>
   </div>
  </div>

  <ButtonLoading
   :loading
   :text="t('end_configuration')"
   :execute="proceedFinal"
  />
 </div>
 <div class="mt-4 text-center text-sm">
  {{ $t('already_account') }}
  <NuxtLink to="/auth/login" class="underline">
   {{ $t('login') }}
  </NuxtLink>
 </div>
</template>

<script setup lang="ts">
import { Copy } from 'lucide-vue-next';
import { useToast } from '@/components/ui/toast/use-toast';
const { toast } = useToast();
const { t } = useI18n();
import { generateSeedPhrase, getMasterKeyFromSeed } from '~/utils/crypto';
import type { BIP32Interface } from 'bip32';
import { setKeyValue } from '~/utils/cookies';
const loading = ref(false);

const seed = ref<String[]>(new Array(12));
const userWantToSaveSeed = ref(false);
const userSaveSeedDuration = ref('0');

const plainSeed = generateSeedPhrase();
seed.value = plainSeed.split(' ');

const storeKey = () => {
 const key: BIP32Interface = getMasterKeyFromSeed(plainSeed);
 setKeyValue(userSaveSeedDuration.value, key as string);
 toast({
  title: t('success'),
  description: t('key_seed_saved'),
 });
};

const proceedFinal = () => {
 if (userWantToSaveSeed.value) {
  if (userSaveSeedDuration.value !== '0') {
   storeKey();
  } else {
   toast({
    title: t('error'),
    description: t('select_duration'),
   });
   return;
  }
 }
 navigateTo('/platform');
};

const copy = () => {
 navigator.clipboard.writeText(plainSeed);
 toast({
  title: t('success'),
  description: t('seed_copied'),
 });
};
</script>
