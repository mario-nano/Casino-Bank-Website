<template>
  <div>
    <b-container fluid="md">
      <b-row class='mt-3'>
        <div class='d-flex justify-content-end'>
          <button type="button" class="btn btn-success" @click="showModal('newAccountModal')">
            <font-awesome-icon icon='fa-plus' />
            Open new Account
          </button>
        </div>
      </b-row>
      <b-tab title="Accounts" class='mt-3'>
        <b-card-text>
          <div class="table-responsive">
            <table class='table table-responsive'>
              <thead>
              <tr>
                <th>#</th>
                <th class='text-start'>Type</th>
                <th class='text-start'>Account name</th>
                <th>Balance</th>
                <th class='d-none d-lg-table-cell'>Interest</th>
                <th class='d-none d-lg-table-cell'>Overdraft</th>
                <th>Opened on</th>
                <th>Actions</th>
              </tr>
              </thead>
              <tbody>
              <template v-if='!this.clientStore.accounts.length'>
                <tr class='my-5'>
                  <td colspan='8' class='text-center accounts-empty-cell'>
                    No accounts found.
                  </td>
                </tr>
              </template>
              <template v-else>
                <tr v-for="(account, index) in this.clientStore.accounts" :key="account.id">
                  <td class='text-center'>{{ index + 1 }}</td>
                  <td class='text-start'>{{ account.accountType }}</td>
                  <td class='text-start'>{{ account.name }}</td>
                  <td class='text-center'>${{ (account.balance).toFixed(2) }}</td>
                  <td class='d-none d-lg-table-cell'>{{ account.interest }}</td>
                  <td class='d-none d-lg-table-cell'>{{ account.overdraft }}</td>
                  <td>{{ (account.createdAt).substring(0,10) }}</td>
                  <td>
                    <button
                      title='Edit account'
                      @click='editAccount(account.id)'
                      id='action-buttons'
                      class='btn btn-success btn-sm action-icon action-icon-start'>
                      <font-awesome-icon icon='fa-pen-to-square' />
                    </button>
                    <button
                      title="Close account"
                      @click='deleteAccount(account.id)'
                      id='action-buttons'
                      class='btn btn-danger btn-sm action-icon action-icon-end'>
                      <font-awesome-icon icon='fa-xmark' />
                    </button>
                  </td>
                </tr>
              </template>
              </tbody>
            </table>
          </div>
        </b-card-text>
      </b-tab>
      <!-- Create new Account modal -->
      <div class="modal fade" id="newAccountModal" tabindex="-1" aria-labelledby="newAccountModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="newAccountModalLabel">Open new Account</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <OpenAccount @close="this.closeModal('#newAccountModal')" />
            </div>
          </div>
        </div>
      </div>
      <!-- Edit Account modal -->
      <div class="modal fade" id="editAccountModal" tabindex="-1" aria-labelledby="editAccountModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="editAccountModalLabel">Edit Account</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <EditAccount :editId='this.editId' @close="this.closeModal('#editAccountModal')" />
            </div>
          </div>
        </div>
      </div>
      <DialogWrapper />
    </b-container>
  </div>
</template>

<script>
import OpenAccount from '@/views/components/account/OpenAccount'
import EditAccount from '@/views/components/account/EditAccount'
import { useToast } from 'vue-toastification'
import { useAuthStore, useClientStore } from '@/stores'
import { Modal } from 'bootstrap'
import { confirm } from '@/components/dialogs'
import { DialogWrapper } from 'vue3-promise-dialog'

export default {
  components: {
    OpenAccount,
    EditAccount,
    DialogWrapper
  },
  name: 'Accounts',
  setup() {
    const authStore = useAuthStore()
    const clientStore = useClientStore()

    return {
      authStore,
      clientStore
    }
  },
  mounted() {
    this.reloadAccounts()
  },
  methods: {
    editAccount(accountId) {
      this.editId = accountId
      this.editAccountDetails = this.clientStore.accounts.find(account => account.id === (accountId).toString())
      this.clientStore.editAccountDetails = this.editAccountDetails
      this.clientStore.editAccountInitialDetails = this.editAccountDetails
      this.showModal('editAccountModal')
    },
    async deleteAccount(accountId) {
      const toast = useToast()
      if (await confirm('Are you sure to close this account?')) {
        await this.clientStore.deleteAccount(accountId)
          .then(() => {
            toast.success('Account closed successfully.')
            this.reloadAccounts()
          })
          .catch((error) => {
            console.log('Error on account delete: ' + error)
            toast.error('Error closing account')
          })
      }
    },
    showModal(modalId) {
      const myModal = new Modal(document.getElementById(modalId))
      myModal.show()
    },
    closeModal(modalId) {
      const accountModal = document.querySelector(modalId)
      const modal = Modal.getInstance(accountModal)
      this.reloadAccounts()
      modal.hide()
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
      client: this.authStore.client,
      newAccountModal: false,
      editId: '',
      editAccountDetails: {}
    }
  }
}
</script>
