<script setup>
import { computed } from 'vue'
import { useToast } from 'vue-toastification'
import { PrivateHeader, AdminHeader } from '@/components'
import { useAuthStore } from '@/stores'
import { router } from '@/router'
import { adminPrompt } from '@/components/dialogs'
import { DialogWrapper } from 'vue3-promise-dialog'

// redirect home if already logged in
const authStore = useAuthStore()
const client = authStore.client
if (!authStore.isAdmin && authStore.client) {
  router.push('/dashboard/home')
}

const currentRouteTitle = computed(() => {
  return router.currentRoute.value.name
})

const adminLogin = async () => {
  const toast = useToast()
  if (await adminPrompt('Please enter admin password')) {
    toast.success('Admin authorization successful.')
    authStore.isAdmin = true
    router.push('/admin/panel')
  }
}
</script>

<template>
  <div class="container min-vh-100 d-flex flex-column content-container">
    <div class="row">
      <div class="col ps-0 pe-0">
        <PrivateHeader v-if='!authStore.isAdmin' />
        <AdminHeader v-else />
      </div>
    </div>
    <div class="row flex-grow-1 m-3">
      <div class="col ps-0 pe-0">
        <div class='d-flex flex-row'>
          <div class='d-flex flex-row'>
            <font-awesome-icon class="me-1" icon="fa-solid fa-house-user" />
            <span class="fw-bold">{{ currentRouteTitle }}</span>
          </div>
          <div class="w-100 d-flex justify-content-end fw-bold">
            <span v-show='!authStore.isAdmin'>Client name: {{ client.firstName }} {{ client.lastName }}</span>
            <span v-show='authStore.isAdmin'>Welcome, Admin</span>
          </div>
        </div>
        <main>
          <router-view />
        </main>
      </div>
    </div>
    <div class="row">
      <div class="col ps-0 pe-0">
        <div class='d-flex flex-row'>
          <div class='w-100 d-flex align-items-center bg-primary text-white ps-3 pt-2 pb-2 text-start'>
            Group-28 Banino - Feeling lucky today?
          </div>
          <div class='d-flex align-items-center bg-primary text-end ps-3 pe-3 flex-end'>
            <button v-show='!authStore.isAdmin' class='btn btn-outline-light btn-sm' @click='adminLogin()'>Admin</button>
          </div>
        </div>
      </div>
    </div>
    <DialogWrapper />
  </div>
</template>
