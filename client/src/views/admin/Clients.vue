<template>
  <div>
    <b-container fluid="md">
      <b-tab title="Clients" class='mt-3'>
        <b-card-text>
          <div class="table-responsive">
            <table class='table table-responsive'>
              <thead>
              <tr>
                <th>#</th>
                <th class='text-start'>Firstname</th>
                <th class='text-start'>Lastname</th>
                <th>Username</th>
                <th class='d-none d-lg-table-cell'>Accounts</th>
                <th class='d-none d-lg-table-cell'>Total Balance</th>
                <th>Joined on</th>
                <th>Actions</th>
              </tr>
              </thead>
              <tbody>
              <template v-if='!this.adminStore.clients.length'>
                <tr class='my-5'>
                  <td colspan='8' class='text-center clients-empty-cell'>
                    No clients found.
                  </td>
                </tr>
              </template>
              <template v-else>
                <tr v-for="(client, index) in this.adminStore.clients" :key="client.id">
                  <td class='text-center'>{{ index + 1 }}</td>
                  <td class='text-start'>{{ client.firstName }}</td>
                  <td class='text-start'>{{ client.lastName }}</td>
                  <td class='text-center'>{{ client.username }}</td>
                  <td class='d-none d-lg-table-cell'>{{ this.adminStore.getClientStats(client.id).numberOfAccounts }}</td>
                  <td class='d-none d-lg-table-cell'>{{ this.adminStore.getClientStats(client.id).totalBalance }}</td>
                  <td>{{ (client.createdAt).substring(0,10) }}</td>
                  <td>
                    <button
                      title='Edit client'
                      @click='editClient(client.id)'
                      id='action-buttons'
                      class='btn btn-success btn-sm action-icon action-icon-start'>
                      <font-awesome-icon icon='fa-pen-to-square' />
                    </button>
                    <button
                      title="Remove client"
                      @click='removeClient(client.id)'
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
      <!-- Edit Account modal -->
      <div class="modal fade" id="editClientModal" tabindex="-1" aria-labelledby="editClientModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="editClientModalLabel">Edit Client</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <EditClient @close="this.closeModal('#editClientModal')" />
            </div>
          </div>
        </div>
      </div>
      <DialogWrapper />
    </b-container>
  </div>
</template>

<script>
import EditClient from '@/views/components/admin/EditClient'
/* import { useToast } from 'vue-toastification' */
import { useAuthStore, useClientStore, useAdminStore } from '@/stores'
import { Modal } from 'bootstrap'
/* import { confirm } from '@/components/dialogs' */
import { DialogWrapper } from 'vue3-promise-dialog'
import { useToast } from 'vue-toastification'
import { confirm } from '@/components/dialogs'

export default {
  components: {
    EditClient,
    DialogWrapper
  },
  name: 'Clients',
  setup() {
    const authStore = useAuthStore()
    const clientStore = useClientStore()
    const adminStore = useAdminStore()

    return {
      authStore,
      clientStore,
      adminStore
    }
  },
  mounted() {
    this.reloadClients()
  },
  methods: {
    async reloadClients() {
      await this.adminStore.getAllClients()
        .then(() => {
          this.isLoading = false
        })
        .catch((error) => {
          console.log(error)
        })
    },
    showModal(modalId) {
      const myModal = new Modal(document.getElementById(modalId))
      myModal.show()
    },
    closeModal(modalId) {
      const clientModal = document.querySelector(modalId)
      const modal = Modal.getInstance(clientModal)
      this.reloadClients()
      modal.hide()
    },
    editClient(clientId) {
      const clientDetails = this.adminStore.clients.find(client => client.id === (clientId).toString())
      console.log(clientDetails)
      this.adminStore.editClientDetails = clientDetails
      this.adminStore.editAccountInitialDetails = clientDetails
      this.showModal('editClientModal')
    },
    async removeClient(clientId) {
      const toast = useToast()
      if (await confirm('Are you sure to remove this client?')) {
        await this.adminStore.removeClient(clientId)
          .then(() => {
            toast.success('Client removed successfully.')
            this.reloadClients()
          })
          .catch((error) => {
            console.log('Error on client remove: ' + error)
            toast.error('Error removing client')
          })
      }
    }
  },
  data() {
    return {
      filter: '',
      isLoading: true
    }
  }
}
</script>
