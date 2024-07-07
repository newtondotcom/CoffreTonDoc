<template>
  <div class="flex flex-col justify-center align-middle">
    <Label for="seed">{{ $t("seed_phrase") }}</Label>
    <div class="grid grid-cols-3 gap-x-2 gap-y-4">
      <div
        v-for="i in seed.length"
        :key="i"
        class="flex items-center space-x-2"
      >
        <Input
          :id="'seed-' + i"
          type="text"
          placeholder="random"
          required
          class="w-[100px]"
          v-model="seed[i]"
        />
      </div>
      <Button
        variant="secondary"
        type="submit"
        size="sm"
        class="px-3"
        @click="copy"
      >
        <span class="sr-only">Copy</span>
        <Copy class="w-4 h-4" />
      </Button>
    </div>
    <div class="grid gap-2">
      <Label for="password">{{ $t("password") }}</Label>
      <Button @click="generateSeed">{{ $t("generate_seed") }}</Button>
    </div>
    <div class="grid gap-2">
      <Label for="password">{{ $t("save_seed") }}</Label>
      <Switch :checked="userWantToSaveSeed" />
      <Label for="password">{{ $t("save_duration") }}</Label>
      <Select v-model="userSaveSeedDuration">
        <SelectTrigger class="w-[180px]">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value="1"> 1 day </SelectItem>
            <SelectItem value="30"> 30 days </SelectItem>
            <SelectItem value="365"> 1 year </SelectItem>
            <SelectItem value="99*365"> 99 years </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>

    <ButtonLoading
      :loading
      :text="t('end_configuration')"
      :execute="proceedFinal"
    />
  </div>
  <div class="mt-4 text-center text-sm">
    {{ $t("already_account") }}
    <NuxtLink to="/auth/login" class="underline">
      {{ $t("login") }}
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { Copy } from "lucide-vue-next";
import { useToast } from "@/components/ui/toast/use-toast";
const { toast } = useToast();
const { t } = useI18n();
import { generateSeedPhrase, getMasterKeyFromSeed } from "~/utils/crypto";
import * as bip32 from "bip32";
import { setKeyValue } from "~/utils/cookies";
const loading = ref(false);

const seed = ref<String[]>(new Array(12));
const userWantToSaveSeed = ref(false);
const userSaveSeedDuration = ref("0");

const generateSeed = () => {
  const plainSeed = generateSeedPhrase();
  seed.value = plainSeed.split(" ");
};

const storeKey = () => {
  const key: bip32.BIP32Interface = getMasterKeyFromSeed(seed.value.join(" "));
  setKeyValue(userSaveSeedDuration, key as string);
  toast({
    title: t("success"),
    description: t("key_seed_saved"),
  });
};

const proceedFinal = () => {
  if (userWantToSaveSeed.value) {
    storeKey();
  }
  navigateTo("/platform");
};

const copy = () => {
  navigator.clipboard.writeText(seed.join(" ").value);
  toast({
    title: t("success"),
    description: t("seed_copied"),
  });
};
</script>
