<script setup>
import { Form, Field } from 'vee-validate'
import * as Yup from 'yup'
import { useClientStore } from '@/stores'
import { router } from '@/router'
import { useToast } from 'vue-toastification'

const schema = Yup.object().shape({
  firstName: Yup.string()
    .required('First Name is required'),
  lastName: Yup.string()
    .required('Last Name is required'),
  address: Yup.string()
    .required('Your address is required'),
  city: Yup.string()
    .required('City is required'),
  username: Yup.string()
    .required('Username is required')
    .matches(/^(?=.*[a-zA-Z]{1,})(?=.*[\d]{0,})[a-zA-Z0-9]{5,15}$/, 'Username must be 5-15 characters with only letters and numbers without spaces or special characters'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: Yup.string()
    .required('Password needs to be confirmed')
    .oneOf([Yup.ref('password'), null], 'Password and confirm password must match')
})

async function onSubmit(values) {
  const clientStore = useClientStore()
  const toast = useToast()
  await clientStore.register(values)
    .then((data) => {
      console.log(data)
      router.push('/public/login')
      toast.success('Registration successful')
    })
    .catch((error) => {
      console.log('Error on submit: ' + error)
      toast.error('Username already exists')
    })
}
</script>

<template>
  <div class="card box-shadow-lg m-3">
    <h4 class="card-header text-shadow1-gray400 p-3">Register</h4>
    <div class="card-body p-4">
      <Form @submit="onSubmit" :validation-schema="schema" v-slot="{ errors, isSubmitting }">
        <!-- Client firstname, lastname -->
        <div class='row'>
          <div class='col-lg-6 col-sm-12 mb-3'>
            <div class='d-flex flex-column align-items-start'>
              <label class='ms-1'>First Name</label>
              <Field class="form-control" name="firstName" type="text" :class="{ 'is-invalid': errors.firstName }" />
              <div class="invalid-feedback d-flex justify-content-start ms-1">{{ errors.firstName }}</div>
            </div>
          </div>
          <div class='col-lg-6 col-sm-12 mb-3'>
            <div class='d-flex flex-column'>
              <label class='d-flex align-content-start ms-1'>Last Name</label>
              <Field name="lastName" type="text" class="form-control" :class="{ 'is-invalid': errors.lastName }" />
              <div class="invalid-feedback d-flex justify-content-start ms-1">{{ errors.lastName }}</div>
            </div>
          </div>
        </div>
        <!-- Client address, city -->
        <div class='row'>
          <div class='col-lg-6 col-sm-12 mb-3'>
            <div class='d-flex flex-column'>
              <label class='d-flex align-content-start ms-1'>Address</label>
              <Field name="address" type="text" class="form-control" :class="{ 'is-invalid': errors.address }" />
              <div class="invalid-feedback d-flex justify-content-start ms-1">{{ errors.address }}</div>
            </div>
          </div>
          <div class='col-lg-6 col-sm-12 mb-3'>
            <div class='d-flex flex-column'>
              <label class='d-flex align-content-start ms-1'>City:</label>
              <Field name="city" type="text" class="form-control" :class="{ 'is-invalid': errors.city }" />
              <div class="invalid-feedback d-flex justify-content-start ms-1">{{ errors.city }}</div>
            </div>
          </div>
        </div>
        <!-- Client username -->
        <div class='row mb-3'>
          <div class="form-group col-lg-6 col-sm-12">
            <div class='d-flex flex-column'>
              <label class='d-flex align-content-start ms-1'>Username</label>
              <Field name="username" type="text" class="form-control" :class="{ 'is-invalid': errors.username }" />
              <div class="invalid-feedback d-flex justify-content-start ms-1">{{ errors.username }}</div>
            </div>
          </div>
        </div>
        <!-- Client password, confirm password -->
        <div class='row'>
          <div class='col-lg-6 col-sm-12 mb-3'>
            <div class='d-flex flex-column'>
              <label class='d-flex align-content-start ms-1'>Password</label>
              <Field name="password" type="password" class="form-control" :class="{ 'is-invalid': errors.password }" />
              <div class="invalid-feedback d-flex justify-content-start ms-1">{{ errors.password }}</div>
            </div>
          </div>
          <div class='col-lg-6 col-sm-12 mb-3'>
            <div class='d-flex flex-column'>
              <label class='d-flex align-content-start ms-1'>Confirm password</label>
              <Field name="confirmPassword" type="password" class="form-control" :class="{ 'is-invalid': errors.confirmPassword }" />
              <div class="invalid-feedback d-flex justify-content-start ms-1">{{ errors.confirmPassword }}</div>
            </div>
          </div>
        </div>
        <!-- Buttons -->
        <div class="form-group mt-4">
          <button class="btn btn-success me-3 ps-4 pe-4" :disabled="isSubmitting">
            <span v-show="isSubmitting" class="spinner-border spinner-border-sm mr-1"></span>
              Register
          </button>
          <button type='reset' class="btn btn-secondary me-3 ps-4 pe-4">
            Reset
          </button>
        </div>
        <div class='mt-4 mb-2'>Already a client? <router-link class='text-success ms-1 fw-bold' to='/public/login'>Login here</router-link></div>
      </Form>
    </div>
  </div>
</template>
