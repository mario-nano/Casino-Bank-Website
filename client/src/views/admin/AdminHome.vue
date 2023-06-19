<template>
  <div class="py-4 container-fluid">
    <!-- Client info cards -->
    <div class="row d-flex justify-content-center">
      <div class="col-xl-3 col-sm-6 mb-xl-0 mb-3 me-4">
        <!-- Number of Clients -->
        <info-card
          :title="{ text: 'Clients', color: 'text-success'}"
          :value="{ text: adminStore.clients.length, color: 'text-dark'}"
          :icon="{src: 'fa-users'}"
          direction-reverse
        />
      </div>
      <div class="col-xl-3 col-sm-6 mb-xl-0 mb-3 me-4">
        <!-- Number of accounts for the Client -->
        <info-card
          :title="{ text: 'Accounts', color: 'text-success'}"
          :value="{ text: adminStore.accounts.length, color: 'text-dark'}"
          :icon="{src: 'fa-address-book'}"
          direction-reverse
        />
      </div>
      <div class="col-xl-3 col-sm-6 mb-xl-0 mb-3 me-4">
        <!-- Number of transactions for the Client -->
        <info-card
          :title="{ text: 'Transactions', color: 'text-success'}"
          :value="{ text: adminStore.transactions.length, color: 'text-dark'}"
          :icon="{src: 'fa-money-bill-transfer'}"
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
              <div class='col-sm-12 col-xs-12 d-flex justify-content-center'>
                <action-lg-button :link="{to: '/admin/clients'}" :icon="{src: 'fa-users'}" :title="{text: 'Manage Clients'}" />
              </div>
            </div>
          </b-card-body>
        </b-card>
      </div>
      <div class='col-xl-8 col-sm-12'>
        <b-card class='h-100'>
          <b-card-title class='bg-gray200 fs-4 py-1'>Admin functions</b-card-title>
          <b-card-body>
            <div class='row p-3 text-danger mb-3'>
              Please proceed with these admin functions with high caution. These functions will destroy all records in the
              database and cannot be reversed unless you did something smart with Atlas DB backups or magic.
            </div>
            <!-- Delete all transactions  -->
            <div class='row mb-5'>
              <div class='col-7 ps-4 text-start'><h5>1. Delete all transactions</h5></div>
              <div class='col-5'><button class='w-75 btn btn-outline-danger' @click='deleteAllTransactions()'>Delete all transactions</button></div>
            </div>
            <!-- Delete all accounts  -->
            <div class='row mb-5'>
              <div class='col-7 ps-4 text-start'><h5>2. Delete all accounts</h5></div>
              <div class='col-5'><button class='w-75 btn btn-outline-danger' @click='deleteAllAccounts()'>Delete all accounts</button></div>
            </div>
            <!-- Delete all clients  -->
            <div class='row'>
              <div class='col-7 ps-4 text-start'><h5>3. Delete all clients</h5></div>
              <div class='col-5'><button class='w-75 btn btn-outline-danger' @click='deleteAllClients()'>Delete all clients</button></div>
            </div>
          </b-card-body>
        </b-card>
      </div>
    </div>
    <DialogWrapper />
  </div>
</template>

<script>
import { useToast } from 'vue-toastification'
import InfoCard from '@/components/InfoCard'
import ActionLgButton from '@/components/ActionLgButton'
import { useAuthStore, useClientStore, useAdminStore } from '@/stores'
import { confirm } from '@/components/dialogs'
import { DialogWrapper } from 'vue3-promise-dialog'

export default {
  name: 'ClientHome',
  components: {
    InfoCard,
    ActionLgButton,
    DialogWrapper
  },
  setup() {
    const authStore = useAuthStore()
    const clientStore = useClientStore()
    const adminStore = useAdminStore()
    const toast = useToast()

    return {
      authStore, clientStore, adminStore, toast
    }
  },
  methods: {
    async reloadAll() {
      await this.adminStore.getAllClients()
        .then(() => {
          this.isLoading = false
        })
        .catch((error) => {
          console.log(error)
        })

      await this.adminStore.getAllAccounts()
        .then(() => {
          this.isLoading = false
        })
        .catch((error) => {
          console.log(error)
        })

      await this.adminStore.getAllTransactions()
        .then(() => {
          this.isLoading = false
        })
        .catch((error) => {
          console.log(error)
        })
    },
    async deleteAllTransactions() {
      if (await confirm('Are you really sure?')) {
        await this.adminStore.deleteAllTransactions()
          .then(() => {
            this.reloadAll()
            this.toast.success('All transactions deleted successfully.')
          })
          .catch((error) => {
            console.log('Error on transaction delete all: ' + error)
            this.toast.error('Error deleting transactions')
          })
      }
    },
    async deleteAllAccounts() {
      if (await confirm('Are you really sure?')) {
        await this.adminStore.deleteAllAccounts()
          .then(() => {
            this.reloadAll()
            this.toast.success('All accounts deleted successfully.')
          })
          .catch((error) => {
            console.log('Error on account delete all: ' + error)
            this.toast.error('Error deleting accounts')
          })
      }
    },
    async deleteAllClients() {
      if (await confirm('Are you really sure?')) {
        await this.adminStore.deleteAllClients()
          .then(() => {
            this.reloadAll()
            this.toast.success('All clients deleted successfully.')
          })
          .catch((error) => {
            console.log('Error on client delete all: ' + error)
            this.toast.error('Error deleting clients')
          })
      }
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
  mounted() {
    this.reloadAll()
  }
}
</script>
<style scoped></style>
