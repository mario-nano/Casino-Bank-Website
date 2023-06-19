import { defineStore } from 'pinia'
import Axios from '@/api.js'
import { router } from '@/router'
import { useToast } from 'vue-toastification'

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    isLoggedIn: false,
    isAdmin: false,
    client: {},
    returnUrl: null
  }),
  actions: {
    async login(username, password) {
      const toast = useToast()
      await Axios.post('/auth/login', { username, password })
        .then((response) => {
          this.client = response.data
          this.isLoggedIn = true
          // redirect to previous url or default to home page
          router.push(this.returnUrl || '/dashboard/home')
          toast.success('Login successful')
        })
        .catch((error) => {
          console.log('Error on login: ' + error)
          toast.error('Invalid username or password.')
        })
    },
    logout() {
      this.client = null
      this.isLoggedIn = false
      router.push('/client/login')
    },
    adminLogout() {
      this.client = null
      this.isLoggedIn = false
      this.isAdmin = false
      router.push('/client/login')
    }
  }
})
