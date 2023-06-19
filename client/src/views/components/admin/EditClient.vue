<script setup>
import { defineProps, defineEmits } from 'vue'
import { useAdminStore } from '@/stores'
import { useToast } from 'vue-toastification'
import { Form, Field } from 'vee-validate'
import * as Yup from 'yup'

const adminStore = useAdminStore()
const emit = defineEmits(['close'])

defineProps({
  editId: String,
  balance: Number,
  accountName: String
})

const schema = Yup.object().shape({
  firstName: Yup.string()
    .test(
      'Client firstname is required',
      'Client firstname cannot be empty',
      () => adminStore.editClientDetails.firstName !== ''),
  lastName: Yup.string()
    .test(
      'Client lastname is required',
      'Client lastname cannot be empty',
      () => adminStore.editClientDetails.lastName !== ''),
  username: Yup.string()
    .test(
      'Client username is required',
      'Client username cannot be empty',
      () => adminStore.editClientDetails.username !== ''),
  address: Yup.string()
    .test(
      'Client address is required',
      'Client address cannot be empty',
      () => adminStore.editClientDetails.address !== ''),
  city: Yup.string()
    .test(
      'Client city is required',
      'Client city cannot be empty',
      () => adminStore.editClientDetails.city !== '')
})

function handleChange(field, value) {
  adminStore.editClientDetails[field] = value
}

function closeModal() {
  emit('close', 'editAccount')
}

async function onSubmit() {
  const toast = useToast()
  let clientSuccess = false
  const client = {
    firstName: adminStore.editClientDetails.firstName,
    lastName: adminStore.editClientDetails.lastName,
    username: adminStore.editClientDetails.username,
    address: adminStore.editClientDetails.address,
    city: adminStore.editClientDetails.city
  }

  try {
    await adminStore.editClient(adminStore.editClientDetails.id, client)
      .then(() => {
        clientSuccess = true
        toast.success('Client updated successfully.')
      })
      .catch((error) => {
        console.log('Error on client update: ' + error)
        toast.error('Error updating client details')
      })
    if (clientSuccess) {
      emit('close', 'editClient')
    }
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <div>
    <Form @submit="onSubmit" :validation-schema="schema" v-slot="{ errors, isSubmitting }">
      <!-- Client firstname -->
      <div class='row'>
        <div class='col-8 mb-2'>
          <div class='d-flex flex-column align-items-start'>
            <label class='ms-1'>First name</label>
            <Field name='firstName' :value="adminStore.editClientDetails.firstName" v-slot="{ clientNameField }" type="text">
              <input
                v-bind="clientNameField"
                name='firstName'
                class='form-control'
                type="text"
                :value="adminStore.editClientDetails.firstName"
                :class="{ 'is-invalid': errors.firstName }"
                @change="(e) => handleChange(e.target.name, e.target.value)"
              />
            </Field>
            <div class="invalid-feedback d-flex justify-content-start ms-1">{{ errors.firstName }}</div>
          </div>
        </div>
      </div>
      <!-- Client lastname -->
      <div class='row'>
        <div class='col-8 mb-2'>
          <div class='d-flex flex-column align-items-start'>
            <label class='ms-1'>Last name</label>
            <Field name='lastName' :value="adminStore.editClientDetails.lastName" v-slot="{ clientLastNameField }" type="text">
              <input
                v-bind="clientLastNameField"
                name='lastName'
                class='form-control'
                type="text"
                :value="adminStore.editClientDetails.lastName"
                :class="{ 'is-invalid': errors.lastName }"
                @change="(e) => handleChange(e.target.name, e.target.value)"
              />
            </Field>
            <div class="invalid-feedback d-flex justify-content-start ms-1">{{ errors.lastName }}</div>
          </div>
        </div>
      </div>
      <!-- Client username -->
      <div class='row'>
        <div class='col-8 mb-2'>
          <div class='d-flex flex-column align-items-start'>
            <label class='ms-1'>Username</label>
            <Field name='username' :value="adminStore.editClientDetails.username" v-slot="{ clientUsernameField }" type="text">
              <input
                v-bind="clientUsernameField"
                name='username'
                class='form-control'
                type="text"
                :value="adminStore.editClientDetails.username"
                :class="{ 'is-invalid': errors.username }"
                @change="(e) => handleChange(e.target.name, e.target.value)"
              />
            </Field>
            <div class="invalid-feedback d-flex justify-content-start ms-1">{{ errors.username }}</div>
          </div>
        </div>
      </div>
      <!-- Client address -->
      <div class='row'>
        <div class='col-8 mb-2'>
          <div class='d-flex flex-column align-items-start'>
            <label class='ms-1'>Address</label>
            <Field name='address' :value="adminStore.editClientDetails.address" v-slot="{ clientAddressField }" type="text">
              <input
                v-bind="clientAddressField"
                name='address'
                class='form-control'
                type="text"
                :value="adminStore.editClientDetails.address"
                :class="{ 'is-invalid': errors.address }"
                @change="(e) => handleChange(e.target.name, e.target.value)"
              />
            </Field>
            <div class="invalid-feedback d-flex justify-content-start ms-1">{{ errors.address }}</div>
          </div>
        </div>
      </div>
      <!-- Client city -->
      <div class='row'>
        <div class='col-8 mb-2'>
          <div class='d-flex flex-column align-items-start'>
            <label class='ms-1'>City</label>
            <Field name='city' :value="adminStore.editClientDetails.city" v-slot="{ clientCityField }" type="text">
              <input
                v-bind="clientCityField"
                name='city'
                class='form-control'
                type="text"
                :value="adminStore.editClientDetails.city"
                :class="{ 'is-invalid': errors.city }"
                @change="(e) => handleChange(e.target.name, e.target.value)"
              />
            </Field>
            <div class="invalid-feedback d-flex justify-content-start ms-1">{{ errors.city }}</div>
          </div>
        </div>
      </div>
<!--      &lt;!&ndash; Account balance &ndash;&gt;
      <div class='row'>
        <div class='col-8 mb-2'>
          <div class='d-flex flex-column align-items-start'>
            <label class='ms-1'>Current balance</label>
            <Field name='balance' v-slot="{ balanceField }" type="number">
              <input
                v-bind="balanceField"
                name='balance'
                class='form-control'
                disabled='true'
                type="number"
                :value="this.editAccountDetails.balance" />
            </Field>
            <p class='text-start fs-6 text-small'>* Cannot edit balance. You need to make transactions.</p>
          </div>
        </div>
      </div>-->
      <!-- Buttons -->
      <div class='row'>
        <div class='col-12'>
          <div class="d-flex justify-content-center form-group mt-4">
            <button class="btn btn-success me-3 ps-4 pe-4" type='submit' :disabled="isSubmitting">
              <span v-show="isSubmitting" class="spinner-border spinner-border-sm mr-1"></span>
              Save
            </button>
            <button class="btn btn-secondary me-3 ps-4 pe-4" type='button' @click='closeModal()'>
              Close
            </button>
          </div>
        </div>
      </div>
    </Form>
  </div>
</template>
