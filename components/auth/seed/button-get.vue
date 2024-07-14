<template>
    <ButtonLoading v-if="keySaved" :loading :text :execute="localFunction" />

    <Dialog v-else>
        <DialogTrigger as-child>
            <Button variant="outline">Edit Profile</Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                    Make changes to your profile here. Click save when you're done.
                </DialogDescription>
            </DialogHeader>
            <div class="flex flex-col justify-center align-middle">
                <Label class="my-2" for="seed">{{ $t('seed_phrase') }}</Label>
                <div class="grid gap-2">
                    <div class="">
                        <Input
                            v-for="i in seed.length"
                            id="seed"
                            type="text"
                            placeholder="random"
                            required
                            v-model="input[i]"
                        />
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
                </div>
                <div class="grid gap-2">
                    <Label class="my-2" for="save">{{ $t('save_seed') }}</Label>
                    <Switch id="save" :checked="userWantToSaveSeed" />
                    <Label class="my-2" for="duration">{{ $t('save_duration') }}</Label>
                    <Select id="duration" v-model="userSaveSeedDuration">
                        <SelectTrigger class="w-[180px]">
                            <SelectValue placeholder="Select a fruit" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Fruits</SelectLabel>
                                <SelectItem value="1">1 day</SelectItem>
                                <SelectItem value="30">30 days</SelectItem>
                                <SelectItem value="365">1 year</SelectItem>
                                <SelectItem value="99*365">99 years</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <DialogFooter>
                <ButtonLoading :loading :text :execute="localFunction" />
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
    defineProps({
      provideKey: {
        type: Function,
        required: true
      },
      text : {
        type : String,
        required : true
      },
      loading : {
        type : Boolean,
        required : true
      }
    })

    import { getKeyValue } from '@/utils/cookies';

    const keySaved = ref(false);
    const key = ref("");

    if (getKeyValue()){
        keySaved.value = false;
        key.value = getKeyValue();
    }

    const seed = ref<String[]>(new Array(12));
    const userWantToSaveSeed = ref(false);
    const userSaveSeedDuration = ref(0);

    const storeKey = () => {
      const key : bip32.BIP32Interface = getMasterKeyFromSeed(seed.value.join(" "));
      setKeyValue(userSaveSeedDuration,key as string);
      toast({
          title: t("success"),
          description: t("key_seed_saved"),
        });
    }

    async function localFunction () => {
      if (!keySaved && userWantToSaveSeed.value){
        storeKey();
      }
      props.provideKey()
    }
</script>
