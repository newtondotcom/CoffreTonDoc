<script setup lang="ts">
const supabase = useSupabaseClient()

const factors = ref([])
const error = ref('')
const factorId = ref(-1);

onMounted(async () => {
  try {
    const { data, error } = await supabase.auth.mfa.listFactors()
    if (error) {
      throw error
    }

    factors.value = data.totp
  } catch (err) {
    console.error(err)
  }
})

async function unenroll() {
  try {
    const { error } = await supabase.auth.mfa.unenroll({ factorId: factorId.value })
    if (error) {
      throw error
    }

    // You might want to add some success handling here
  } catch (err) {
    console.error(err)
  }
}
</script>

<template>
  <div>
    <div v-if="error" class="error">{{ error }}</div>
    <table>
      <tbody>
        <tr>
          <td>Factor ID</td>
          <td>Friendly Name</td>
          <td>Factor Status</td>
        </tr>
        <Dialog>
          <DialogTrigger as-child>
            <tr v-for="factor in factors" :key="factor.id" @click="factorId = factor.id">
              <td>{{ factor.id }}</td>
              <td>{{ factor.friendly_name }}</td>
              <td>{{ factor.factor_type }}</td>
              <td>{{ factor.status }}</td>
            </tr>
          </DialogTrigger>

          <DialogContent class="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Unenroll the device</DialogTitle>
              <DialogDescription>
                Do you really want to unenroll this device ?
              </DialogDescription>
            </DialogHeader>

            <!--
            <div class="grid gap-4 py-4">
            </div>
            -->
            
            <DialogFooter>
              <DialogClose as-child>
                <Button>
                  Close
                </Button>
              </DialogClose>
              <Button @click="unenroll">
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </tbody>
    </table>

  </div>
</template>
