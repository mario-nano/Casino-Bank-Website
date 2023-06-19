<template>
  <div class="py-4 container-fluid">
    <!-- Client info cards -->
    <div class="row">
      <div class="col-xl-3 col-sm-6 mb-xl-0 mb-3">
        <!-- Number of accounts for the Client -->
        <info-card
          :title="{ text: 'Accounts', color: 'text-success'}"
          :value="{ text: numberOfAccounts('accounts'), color: 'text-dark'}"
          :icon="{src: 'fa-address-book'}"
          direction-reverse
        />
      </div>
      <div class="col-xl-3 col-sm-6 mb-xl-0 mb-3">
        <!-- Total balance for the Client -->
        <info-card
          :title="{ text: 'Total balance', color: 'text-success'}"
          :value="{ text: '$' + showTotalBalance(), color: 'text-dark'}"
          :icon="{src: 'fa-hand-holding-usd'}"
          direction-reverse
        />
      </div>
      <div class="col-xl-3 col-sm-6 mb-xl-0 mb-3">
        <!-- Number of transactions for the Client -->
        <info-card
          :title="{ text: 'Transactions', color: 'text-success'}"
          :value="{ text: numberOfTransactions(), color: 'text-dark'}"
          :icon="{src: 'fa-money-bill-transfer'}"
          direction-reverse
        />
      </div>
      <div class="col-xl-3 col-sm-6 mb-xl-0">
        <!-- Number of transactions for the Client -->
        <info-card
          :title="{ text: 'Total winnings', color: 'text-success'}"
          :value="{ text: '$' + this.clientStore.totalWinnings, color: 'text-dark'}"
          :icon="{src: 'fa-star'}"
          direction-reverse
        />
      </div>
    </div>
    <div class="row">
      <div class='col-xl-4 col-sm-12 mb-xxl-0 mb-xl-0 mb-lg-3 mb-md-3 mb-sm-3 mb-3'>
        <b-card class='container'>
          <b-card-title class='bg-gray200 fs-4 py-1'>Manage your bank</b-card-title>
          <b-card-body>
            <div class='row'>
              <div class='col-sm-6 col-xs-12 d-flex justify-content-center'>
                <action-lg-button :link="{to: '/dashboard/accounts'}" :icon="{src: 'fa-wallet'}" :title="{text: 'Manage Accounts'}" />
              </div>
              <div class='col-sm-6 col-xs-12 d-flex justify-content-center'>
                <action-lg-button :link="{to: '/dashboard/transactions'}" :icon="{src: 'fa-right-left'}" :title="{text: 'Transactions'}" />
              </div>
              <div class='col-sm-6 col-xs-12 d-flex justify-content-center'>
                <action-lg-button :link="{to: '/dashboard/banino'}" :icon="{src: 'fa-dice'}" :title="{text: 'Play Banino'}" />
              </div>
              <div class='col-sm-6 col-xs-12 d-flex justify-content-center'>
                <action-lg-button :icon="{src: 'fa-gear'}" :title="{text: 'Manage Profile'}" />
              </div>
            </div>
          </b-card-body>
        </b-card>
      </div>
      <div class='col-xl-8 col-sm-12'>
        <b-card class='h-100'>
          <b-card-title class='bg-gray200 fs-4 py-1'>Recent transactions</b-card-title>
          <b-card-body>
            <div class='mt-5 mb-5' v-if='isLoading'><b-spinner variant="success"></b-spinner></div>
            <table class='table table-responsive'>
              <thead>
              <tr>
                <th>#</th>
                <th>Transaction type</th>
                <th>Amount</th>
                <th>State</th>
                <th>Date</th>
              </tr>
              </thead>
              <tbody>
              <template v-if='!transactions.length'>
                <tr class='my-5'>
                  <td colspan='5' class='text-center pt-5 pb-5'>
                    No transactions found.
                  </td>
                </tr>
              </template>
              <template v-else>
                <tr v-for="(trans, index) in transactions" :key="trans.id">
                  <td class='text-center'>{{ index + 1 }}</td>
                  <td class='text-start'>{{ trans.transactionType }}</td>
                  <td class='text-center'>{{ trans.amount }}</td>
                  <td>{{ trans.state }}</td>
                  <td>{{ (trans.createdAt).substring(0,10) }}</td>
                </tr>
              </template>
              </tbody>
            </table>
          </b-card-body>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import InfoCard from '@/components/InfoCard'
import ActionLgButton from '@/components/ActionLgButton'
import { useAuthStore, useClientStore } from '@/stores'

export default {
  name: 'DashboardHome',
  components: { InfoCard, ActionLgButton },
  setup() {
    const authStore = useAuthStore()
    const clientStore = useClientStore()

    return {
      authStore, clientStore
    }
  },
  methods: {
    numberOfAccounts: function () {
      return this.clientStore.accounts.length
    },
    numberOfTransactions: function (field) {
      return this.clientStore.transactions.length
    },
    showTotalBalance() {
      return this.clientStore.getTotalBalance
    }
  },
  data() {
    return {
      isLoading: true,
      transactionFields: [
        { key: 'id' },
        { key: 'type' },
        { key: 'amount' },
        { key: 'state' },
        { key: 'createdAt' }
      ],
      transactions: [],
      client: this.authStore.client
    }
  },
  async mounted() {
    await this.clientStore.getRecentTransactions(this.client.id)
      .then(() => {
        this.transactions = this.clientStore.getRecentTransactionsList
        this.isLoading = false
      })
      .catch((error) => {
        console.log(error)
      })

    await this.clientStore.getAllAccounts(this.client.id)
      .then(() => {
        this.isLoading = false
      })
      .catch((error) => {
        console.log(error)
      })

    await this.clientStore.getAllTransactions(this.client.id)
      .then(() => {
        this.isLoading = false
      })
      .catch((error) => {
        console.log(error)
      })
  }
}
</script>
<style scoped></style>
