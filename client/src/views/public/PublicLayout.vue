<script setup>
import { useAuthStore } from '@/stores'
import { router } from '@/router'
import { PublicHeader } from '@/components'

// redirect home if already logged in
const authStore = useAuthStore()
if (authStore.client) {
  router.push('/')
}
</script>

<template>
  <div class='container min-vh-100 d-flex flex-column content-container'>
    <div class='row'>
      <div class='col ps-0 pe-0'>
        <PublicHeader />
      </div>
    </div>
    <div class='row flex-grow-1'>
      <div class='col ps-0 pe-0'>
        <div class='container h-100'>
          <div class="row h-100">
            <div class='d-flex justify-content-center align-items-center'>
              <router-view />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
