<script setup lang="ts">
import {Trash2} from 'lucide-vue-next';
const supabase = useSupabaseClient();

const factors = ref([]);
const error = ref("");
const factorId = ref(-1);

onMounted(async () => {
  try {
    const { data, error } = await supabase.auth.mfa.listFactors();
    if (error) {
      throw error;
    }

    factors.value = data.totp;
  } catch (err) {
    console.error(err);
  }
});

async function unenroll() {
  try {
    const { error } = await supabase.auth.mfa.unenroll({
      factorId: factorId.value,
    });
    if (error) {
      throw error;
    }

    // You might want to add some success handling here
  } catch (err) {
    console.error(err);
  }
}
</script>

<template>
  <div>
    <div v-if="error" class="error">{{ error }}</div>
    <Dialog>
      <Table>
        <TableCaption>{{ $t('mfa_list') }}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead class="w-[100px]">{{ $t('list_name') }}</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead class="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="factor in factors" :key="factor.id">
            <TableCell class="font-medium">
              {{ factor.friendly_name }}
            </TableCell>
            <TableCell>{{ factor.id }}</TableCell>
            <TableCell>{{ factor.factor_type }}</TableCell>
            <TableCell class="text-right">
              {{ factor.status }}
            </TableCell>
            <DialogTrigger as-child>
              <TableCell class="text-right">
                <Trash2 />
              </TableCell>
            </DialogTrigger>
          </TableRow>
        </TableBody>
      </Table>

      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{{ $t('unenroll_device') }}</DialogTitle>
          <DialogDescription>
            {{ $t('unenroll_confirmation') }}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose as-child>
            <Button>{{ $t('close') }}</Button>
          </DialogClose>
          <Button @click="unenroll">{{ $t('save_changes') }}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
