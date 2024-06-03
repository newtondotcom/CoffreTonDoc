<template>
    <div class="card shadow-card">
        <FormLabel icon="file-text">
            {{ $t('transactions') }}
        </FormLabel>

        <DatatableWrapper
            class="overflow-x-auto"
            api="/api/subscriptions/transactions"
            :paginator="true"
            :columns="columns"
        >
            <template slot-scope="{ row }">
                <FixedTransactionRow :row="row" />
            </template>

            <!--Empty page-->
            <template v-slot:empty-page>
                <InfoBox style="margin-bottom: 0">
                    <p>{{ $t('user_invoices.empty') }}</p>
                </InfoBox>
            </template>
        </DatatableWrapper>
    </div>
</template>
<script>
import InfoBox from '@/components/provided/UI/Others/InfoBox'
import DatatableWrapper from '@/components/provided/UI/Table/DatatableWrapper'
import FixedTransactionRow from './FixedTransactionRow'
import FormLabel from '@/components/provided/UI/Labels/FormLabel'
import ColorLabel from '@/components/provided/UI/Labels/ColorLabel'

export default {
    name: 'UserTransactionsForFixedBilling',
    components: {
        FixedTransactionRow,
        DatatableWrapper,
        ColorLabel,
        FormLabel,
        InfoBox,
    },
    computed: {
        columns() {
            return this.$store.getters.transactionColumns.filter(
                (column) => !['type', 'user_id'].includes(column.field)
            )
        },
    },
}
</script>
