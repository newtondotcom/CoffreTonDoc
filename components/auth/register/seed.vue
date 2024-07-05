<template>

<div class="flex flex-col justify-center align-middle">
          <Label for="seed">{{ $t("seed_phrase") }}</Label>
          <div class="grid gap-2">
            <div class="">
            <Input
              v-for="input in seed"
              id="seed"
              type="text"
              placeholder="random"
              required
              v-model="input"
            />
            <Button variant="secondary" @click="copy">
              Copy
            </Button>
          </div>
          </div>
          <div class="grid gap-2">
            <Label for="password">{{ $t("password") }}</Label>
            <Button name="Generate one" @click="generateSeed"/>
          </div>
          <div class="grid gap-2">
            <Label for="password">{{ $t("save_seed") }}</Label>
            <Switch
                :checked="userWantToSaveSeed"
              />
            <Label for="password">{{ $t("save_duration") }}</Label>
            <Select v-model="userSaveSeedDuration">
    <SelectTrigger class="w-[180px]">
      <SelectValue placeholder="Select a fruit" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Fruits</SelectLabel>
        <SelectItem value="1">
          1 day
        </SelectItem>
        <SelectItem value="30">
          30 days
        </SelectItem>
        <SelectItem value="365">
          1 year
        </SelectItem>
        <SelectItem value="99*365">
          99 years
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
          </div>
          <Button type="submit" class="w-full" @click="proceedFinal">
            <div
              v-if="loading"
              aria-label="Loading..."
              role="status"
              class="align-middle justify-center flex"
            >
              <svg
                class="animate-spin w-6 h-6 fill-slate-800"
                viewBox="3 3 18 18"
              >
                <path
                  class="opacity-20"
                  d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
                ></path>
                <path
                  d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z"
                ></path>
              </svg>
            </div>
            <div v-else>
              {{ $t("end_configuration") }}
            </div>
          </Button>
        </div>
        <div class="mt-4 text-center text-sm">
          {{ $t("already_account") }}
          <NuxtLink to="/auth/login" class="underline">
            {{ $t("login") }}
          </NuxtLink>
        </div>

</template>

<script setup lang="ts">
npx shadcn-vue@latest add switch

import { useToast } from "@/components/ui/toast/use-toast";
const { toast } = useToast();
import errorCodes from "~/utils/codes";
const { t } = useI18n()
import { generateSeedPhrase, getMasterKeyFromSeed } from "~/utils/crypto";
import * as bip32 from 'bip32';
const loading = ref(false);


const seed = ref<String[]>(new Array(12));
const userWantToSaveSeed = ref(false);
const userSaveSeedDuration = ref(0);

const generateSeed = () => {
  const plainSeed = generateSeedPhrase();
  seed.value = plainSeed.split(" ")
}

const storeKey = () => {
  // userSaveSeedDuration.value
  const keyCookie = useCookie('key',{
    maxAge: 60 * 60 * 24 * userSaveSeedDuration.value,
    path: '/',
    secure: true, // Only send cookie over HTTPS
    httpOnly: false, // Allow JavaScript access to cookie
    sameSite: 'strict', // Prevent CSRF attacks
    signed: true, // Sign cookie to verify integrity
  })
  const key : bip32.BIP32Interface = getMasterKeyFromSeed(seed.value.join(" "));
  keyCookie.value = key;   
  toast({
      title: t("success"),
      description: t("key_seed_saved"),
    });
}

const proceedFinal = () => {
  if (userWantToSaveSeed.value){
    storeKey();
  }
  navigateTo("/platform");
}

const copy = () => {
  navigator.clipboard.writeText(seed.join(" ").value);    
  toast({
      title: t("success"),
      description: t("seed_copied"),
    });
}

</script>