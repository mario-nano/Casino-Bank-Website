<script setup>
import { defineEmits } from 'vue'
import { useAuthStore, useClientStore } from '@/stores'
import { useToast } from 'vue-toastification'
import { Form, Field } from 'vee-validate'
import * as Yup from 'yup'

const clientStore = useClientStore()
const authStore = useAuthStore()
const client = authStore.client
const emit = defineEmits(['close'])

const schema = Yup.object().shape({
  accountType: Yup.string()
    .required('Please select account type'),
  accountName: Yup.string()
    .required('Account name is required'),
  balance: Yup.string()
    .required('Account name is required')
    .min(0, 'Minimum balance is 0.00')
    .test(
      'Balance must be positive',
      'Minimum balance must be $0.00 or more.',
      (value) => value >= 0)
})

async function onSubmit(values) {
  const toast = useToast()
  let accountSuccess = false
  const account = {
    name: values.accountName,
    accountType: values.accountType,
    balance: values.balance,
    interest: 5,
    overdraft: 500
  }

  try {
    await clientStore.createAccount(client.id, account)
      .then(() => {
        accountSuccess = true
        toast.success('New account created successfully.')
      })
      .catch((error) => {
        console.log('Error on account create: ' + error)
        toast.error('Error creating a new account')
      })
    if (accountSuccess) {
      emit('close', 'newAccount')
      await clientStore.getAllAccounts(client.id)
      // Hide the modal manually
    }
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <div>
    <Form @submit="onSubmit" :validation-schema="schema" v-slot="{ errors, isSubmitting }">
      <!-- Account type -->
      <div class='row'>
        <div class='col mb-2'>
          <div class='d-flex flex-column align-items-start'>
            <label class='ms-1'>Account type</label>
            <div class='row ms-3'>
              <div class='col'>
                <div class='d-flex flex-row'><Field name="accountType" type="radio" value="Checking" class='me-2' /> Checking</div>
                <div class='d-flex flex-row'><Field name="accountType" type="radio" value="Saving" class='me-2' /> Saving</div>
              </div>
            </div>
            <div class="invalid-feedback d-flex justify-content-start ms-1">{{ errors.accountType }}</div>
          </div>
        </div>
      </div>
      <!-- Account name -->
      <div class='row'>
        <div class='col-8 mb-2'>
          <div class='d-flex flex-column align-items-start'>
            <label class='ms-1'>Account name</label>
            <Field class="form-control" name="accountName" type="text" :class="{ 'is-invalid': errors.accountName }" />
            <div class="invalid-feedback d-flex justify-content-start ms-1">{{ errors.accountName }}</div>
          </div>
        </div>
      </div>
      <!-- Account balance -->
      <div class='row'>
        <div class='col-8 mb-2'>
          <div class='d-flex flex-column align-items-start'>
            <label class='ms-1'>Initial balance</label>
            <Field class="form-control" name="balance" type="number" value='0.00' :class="{ 'is-invalid': errors.balance }" />
            <div class="invalid-feedback d-flex justify-content-start ms-1">{{ errors.balance }}</div>
          </div>
        </div>
      </div>
      <!-- Buttons -->
      <div class='row'>
        <div class='col-12'>
          <div class="d-flex justify-content-center form-group mt-4">
            <button class="btn btn-success me-3 ps-4 pe-4" type='submit' :disabled="isSubmitting">
              <span v-show="isSubmitting" class="spinner-border spinner-border-sm mr-1"></span>
              Create
            </button>
            <button class="btn btn-secondary me-3 ps-4 pe-4" type='button' data-bs-dismiss='modal'>
              Close
            </button>
          </div>
        </div>
      </div>
    </Form>
  </div>
</template>
