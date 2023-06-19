<script setup>
import { ref } from 'vue'
import { Form, Field } from 'vee-validate'
import * as Yup from 'yup'
import { useAuthStore } from '@/stores'

const loginForm = ref()
const schema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required')
})

async function onSubmit(values) {
  const authStore = useAuthStore()
  const { username, password } = values
  await authStore.login(username, password)
}
</script>

<template>
  <div class='col-xxl-4 col-xl-5 col-lg-6'>
    <div class="card box-shadow-lg m-3">
      <h4 class="card-header text-shadow1-gray400 p-3">Login</h4>
      <div class="card-body ps-5 pe-5">
        <Form @submit="onSubmit" :validation-schema="schema" v-slot="{ errors, isSubmitting }" ref="loginForm">
          <div class='row mb-3'>
            <div class="form-group d-flex flex-column align-items-start">
              <label class='ms-1'>Username</label>
              <Field name="username" type="text" class="form-control" :class="{ 'is-invalid': errors.username }" />
              <div class="invalid-feedback d-flex justify-content-start ms-1">{{ errors.username }}</div>
            </div>
          </div>
          <div class='row mb-3'>
            <div class="form-group d-flex flex-column align-items-start">
              <label class='ms-1'>Password</label>
              <Field name="password" type="password" class="form-control" :class="{ 'is-invalid': errors.password }" />
              <div class="invalid-feedback d-flex justify-content-start ms-1">{{ errors.password }}</div>
            </div>
          </div>
          <div class="form-group mt-4">
            <button class="btn btn-success me-3 ps-4 pe-4" :disabled="isSubmitting">
              <span v-show="isSubmitting" class="spinner-border spinner-border-sm mr-1"></span>
              Login
            </button>
            <button type='reset' class="btn btn-secondary me-3 ps-4 pe-4">
              Reset
            </button>
          </div>
          <div class='mt-4 mb-2'>New client? <router-link class='text-success ms-1 fw-bold' to='/public/register'>Register here</router-link></div>
        </Form>
      </div>
    </div>
  </div>
</template>
