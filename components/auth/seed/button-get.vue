<template>
    
    <Button v-if="keySaved" variant="outline">
        <Button type="submit" class="w-full" @click="provideKey(key)">
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
              {{ $t("register") }}
            </div>
          </Button>
    </Button>

  <Dialog v-else>
    <DialogTrigger as-child>
      <Button variant="outline">
        Edit Profile
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Edit profile</DialogTitle>
        <DialogDescription>
          Make changes to your profile here. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="name" class="text-right">
            Name
          </Label>
          <Input id="name" value="Pedro Duarte" class="col-span-3" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="username" class="text-right">
            Username
          </Label>
          <Input id="username" value="@peduarte" class="col-span-3" />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit">
          Save changes
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

</template>

<script lang="ts">
import { getKeyValue } from '@/utils/cookies';

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
const keySaved = ref(false);
const key = ref("");

if (getKeyValue()){
    keySaved.value = false;
    key.value = getKeyValue();
}

</script>