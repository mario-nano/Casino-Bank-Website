import { defineStore } from 'pinia'
import Axios from '@/api.js'

export const useAdminStore = defineStore({
  id: 'admin',
  state: () => ({
    clients: [],
    accounts: [],
    transactions: [],
    totalWinnings: 0,
    account: {},
    editClientDetails: {},
    editClientInitialDetails: {}
  }),
  getters: {
    getRecentTransactionsList(state) {
      return state.recentTransactions
    },
    getTotalBalance(state) {
      return state.totalBalance
    }
  },
  actions: {
    async getAllClients() {
      await Axios.get('./clients/',
        { params: { sort: { createdAt: -1 } }, limit: 0 }
      )
        .then((response) => {
          this.clients = response.data
          this.isLoading = false
        })
        .catch((error) => {
          console.log(error)
        })
    },
    async getAllAccounts() {
      await Axios.get('./accounts/')
        .then((response) => {
          this.accounts = response.data
          this.isLoading = false
        })
        .catch((error) => {
          console.log(error)
        })
    },
    async getAllTransactions() {
      await Axios.get('./transactions/')
        .then((response) => {
          this.transactions = response.data
          this.isLoading = false
        })
        .catch((error) => {
          console.log(error)
        })
    },
    getClientStats(clientId) {
      const clientStats = {
        numberOfAccounts: 0,
        totalBalance: 0,
        numberOfTransactions: 0
      }
      this.accounts.forEach(account => {
        if (account.clientId === clientId) {
          clientStats.numberOfAccounts++
          clientStats.totalBalance += account.balance
        }
      })
      this.transactions.forEach(transaction => {
        if (transaction.clientId === clientId) {
          clientStats.numberOfTransactions++
        }
      })
      return clientStats
    },
    // Client actions
    async editClient(clientId, client) {
      await Axios.patch(`./clients/${clientId}`, client)
    },
    async removeClient(clientId) {
      await Axios.delete(`./clients/${clientId}`)
    },
    // Destroy all calls
    async deleteAllTransactions() {
      await Axios.delete('./transactions/')
    },
    async deleteAllAccounts() {
      await Axios.delete('./accounts/')
    },
    async deleteAllClients() {
      await Axios.delete('./clients/')
    }
  }
})
