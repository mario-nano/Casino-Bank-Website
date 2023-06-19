<script setup>
import { useAuthStore } from '@/stores'
const authStore = useAuthStore()
</script>

<template>
    <b-navbar toggleable="lg" type="dark" variant="success" sticky='top' class='shadow-lg'>
      <b-navbar-brand>
        <b-img src="../../assets/banino-logo.png" height=72 alt="Banino"></b-img>
      </b-navbar-brand>
      <b-navbar-toggle target='nav-collapse'>
        <font-awesome-icon icon="fa-solid fa-bars" />
      </b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class='ms-auto me-5'>
          <b-nav-item class='text-white' to='/dashboard/home'>Dashboard</b-nav-item>
          <b-nav-item class='text-white' to='/dashboard/accounts'>Accounts</b-nav-item>
          <b-nav-item class='text-white' to='/dashboard/transactions'>Transactions</b-nav-item>
          <b-nav-item class='text-white' to='/dashboard/banino'>Banino</b-nav-item>
          <b-nav-item @click="authStore.logout()" class='text-white'>Logout</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
</template>
