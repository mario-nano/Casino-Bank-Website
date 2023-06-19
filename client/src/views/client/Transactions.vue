<template>
  <div>
    <b-container fluid="md">
      <b-row class='mt-3'>
        <div class='d-flex justify-content-end'>
          <button type="button" class="btn btn-outline-success me-2" @click="showModal('makeDepositModal')">
            <font-awesome-icon icon='fa-download' />
            Make deposit
          </button>
          <button type="button" class="btn btn-outline-success me-2" @click="showModal('withdrawalModal')">
            <font-awesome-icon icon='fa-upload' />
            Withdraw money
          </button>
          <button type="button" class="btn btn-outline-success" @click="showModal('transferModal')">
            <font-awesome-icon icon="fa-solid fa-money-bill-transfer" />
            Transfer money
          </button>
        </div>
      </b-row>
      <b-tab title="Transactions" class='mt-3'>
        <b-card-text
        ><div class="">
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
            <template v-if='!this.clientStore.transactions.length'>
              <tr class='my-5'>
                <td colspan='5' class='text-center pt-5 pb-5'>
                  No transactions found.
                </td>
              </tr>
            </template>
            <template v-else>
              <tr v-for="(trans, index) in this.clientStore.transactions" :key="trans.id">
                <td class='text-center'>{{ index + 1 }}</td>
                <td class='text-start'>{{ trans.transactionType }}</td>
                <td class='text-center'>{{ trans.amount }}</td>
                <td>{{ trans.state }}</td>
                <td>{{ (trans.createdAt).substring(0,10) }}</td>
              </tr>
            </template>
            </tbody>
          </table>
        </div>
        </b-card-text>
      </b-tab>
      <!-- Make Deposit modal -->
      <div class="modal fade" id="makeDepositModal" tabindex="-1" aria-labelledby="makeDepositModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="makeDepositModalLabel">Make a Deposit</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" @click="this.closeModal('#makeDepositModal')"></button>
            </div>
            <div class="modal-body">
              <Deposit @close="this.closeModal('#makeDepositModal')" />
            </div>
          </div>
        </div>
      </div>
      <!-- Make Withdrawal modal -->
      <div class="modal fade" id="withdrawalModal" tabindex="-1" aria-labelledby="withdrawalModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="withdrawalModalLabel">Withdraw money</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" @click="this.closeModal('#withdrawalModal')"></button>
            </div>
            <div class="modal-body">
              <Withdrawal @close="this.closeModal('#withdrawalModal')" />
            </div>
          </div>
        </div>
      </div>
      <!-- Transfer modal -->
      <div class="modal fade" id="transferModal" tabindex="-1" aria-labelledby="transferModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="transferModalLabel">Transfer money</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" @click="this.closeModal('#transferModal')"></button>
            </div>
            <div class="modal-body">
              <Transfer @close="this.closeModal('#transferModal')" />
            </div>
          </div>
        </div>
      </div>
    </b-container>
  </div>
</template>

<script>
import { useAuthStore, useClientStore } from '@/stores'
import Deposit from '@/views/components/transaction/Deposit'
import Withdrawal from '@/views/components/transaction/Withdrawal'
import Transfer from '@/views/components/transaction/Transfer'
import { Modal } from 'bootstrap'

export default {
  components: {
    Deposit,
    Withdrawal,
    Transfer
    // eslint-disable-next-line vue/no-unused-components
  },
  name: 'Transactions',
  setup() {
    const authStore = useAuthStore()
    const clientStore = useClientStore()

    return {
      authStore,
      clientStore
    }
  },
  mounted() {
    this.reloadTransactions()
  },
  methods: {
    showModal(modalId) {
      const myModal = new Modal(document.getElementById(modalId))
      myModal.show()
    },
    closeModal(modalId) {
      const transactionModal = document.querySelector(modalId)
      const modal = Modal.getInstance(transactionModal)
      modal.hide()
      this.reloadTransactions()
      this.reloadAccounts()
    },
    async reloadTransactions() {
      await this.clientStore.getAllTransactions(this.authStore.client.id)
        .then(() => {
          this.clientStore.transactionDetails = {
            transactionAccountId: 'DEFAULT',
            transactionRecipientAccountId: 'DEFAULT',
            transactionCurrentBalance: null,
            transactionRecipientCurrentBalance: null,
            transactionAmount: null,
            transactionNewBalance: null,
            transactionRecipientNewBalance: null
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    async reloadAccounts() {
      await this.clientStore.getAllAccounts(this.authStore.client.id)
        .then(() => {
          this.clientStore.editAccountDetails = {}
          this.clientStore.editAccountInitialDetails = {}
          this.isLoading = false
        })
        .catch((error) => {
          console.log(error)
        })
    }
  },
  data() {
    return {
      filter: '',
      transactionFields: [
        { key: 'accountType', sortable: true },
        { key: 'balance', sortable: true },
        { key: 'interest', sortable: true },
        { key: 'overdraft', sortable: true },
        { key: 'createdAt', sortable: true },
        { key: 'id', sortable: true }
      ]
    }
  }
}
</script>
