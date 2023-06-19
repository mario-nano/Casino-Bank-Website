import { defineStore } from 'pinia'
import Axios from '@/api.js'

export const useClientStore = defineStore({
  id: 'clients',
  state: () => ({
    accounts: [],
    transactions: [],
    recentTransactions: [],
    totalWinnings: 0,
    account: {},
    editAccountDetails: {},
    editAccountInitialDetails: {},
    numberOfAccounts: 0,
    totalBalance: 0,
    transactionDetails: {
      transactionAccountId: 'DEFAULT',
      transactionRecipientAccountId: 'DEFAULT',
      transactionCurrentBalance: null,
      transactionRecipientCurrentBalance: null,
      transactionAmount: null,
      transactionNewBalance: null,
      transactionRecipientNewBalance: null
    }
  }),
  getters: {
    getRecentTransactionsList(state) {
      return state.recentTransactions
    },
    getTotalBalance(state) {
      return state.totalBalance
    },
    getNumberOfAccounts(clientId) {
      let sum = 0
      this.accounts.forEach(account => {
        sum += parseFloat(account.balance)
      })
      this.totalBalance = sum
    }
  },
  actions: {
    // Client actions
    async register(client) {
      await Axios.post('/clients/', client)
    },
    async getRecentTransactions(clientId) {
      await Axios.get(`./transactions/clients/${clientId}`,
        { params: { sort: { createdAt: -1 }, limit: 6 } }
      )
        .then((response) => {
          this.recentTransactions = response.data
          this.isLoading = false
        })
        .catch((error) => {
          console.log(error)
        })
    },
    // Client actions
    async createAccount(clientId, account) {
      await Axios.post(`./accounts/clients/${clientId}`, account)
    },
    // Account actions
    async editAccount(accountId, account) {
      await Axios.patch(`./accounts/${accountId}`, account)
    },
    async deleteAccount(accountId) {
      await Axios.delete(`./accounts/${accountId}`)
    },
    async getAllAccounts(clientId) {
      await Axios.get(`./accounts/clients/${clientId}`)
        .then((response) => {
          this.accounts = response.data
          this.isLoading = false
          let sum = 0
          this.accounts.forEach(account => {
            sum += parseFloat(account.balance)
          })
          this.totalBalance = sum
        })
        .catch((error) => {
          console.log(error)
        })
    },
    async getAllTransactions(clientId) {
      await Axios.get(`./transactions/clients/${clientId}`)
        .then((response) => {
          this.transactions = response.data
          this.isLoading = false
          let sumWins = 0
          let sumLoss = 0
          this.transactions.forEach(transaction => {
            if (transaction.transactionType === 'Banino win') {
              sumWins += transaction.amount
            } else if (transaction.transactionType === 'Banino loss') {
              sumLoss += transaction.amount
            }
          })
          this.totalWinnings = sumWins - sumLoss
        })
        .catch((error) => {
          console.log(error)
        })
    },
    async newTransaction(newTransaction) {
      await Axios.post('./transactions/', newTransaction)
    },
    resetTransactionInterim() {
      this.transactionDetails = {
        transactionAccountId: 'DEFAULT',
        transactionRecipientAccountId: 'DEFAULT',
        transactionCurrentBalance: null,
        transactionRecipientCurrentBalance: null,
        transactionAmount: null,
        transactionNewBalance: null,
        transactionRecipientNewBalance: null
      }
    }
  }
})
