<script setup>
import { defineEmits } from 'vue'
import { useAuthStore, useClientStore } from '@/stores'
import { useToast } from 'vue-toastification'
import { Form, Field } from 'vee-validate'
import * as Yup from 'yup'

const clientStore = useClientStore()
const authStore = useAuthStore()
const emit = defineEmits(['close'])

const schema = Yup.object().shape({
  depositAccount: Yup.string()
    .required('Account needs to be selected')
    .test(
      'Please select account',
      'Please select account',
      () => clientStore.transactionDetails.transactionAccountId !== 'DEFAULT')
    .nullable(),
  depositAmount: Yup.string()
    .test(
      'Deposit amount must be positive',
      'Amount must be more than 0.00 and no cents for now ...',
      () => clientStore.transactionDetails.transactionAmount > 0 && Number.isInteger(clientStore.transactionDetails.transactionAmount))
})

const handleChange = (field, value) => {
  if (field === 'depositAccount') {
    clientStore.transactionDetails.transactionAccountId = value
    const depositAccount = clientStore.accounts.find(account => account.id === (value).toString())
    clientStore.transactionDetails.transactionCurrentBalance = depositAccount.balance
  } else if (field === 'depositAmount') {
    clientStore.transactionDetails.transactionAmount = parseInt(value)
  }
  // Calculate new balance
  if (clientStore.transactionDetails.transactionCurrentBalance !== null) {
    clientStore.transactionDetails.transactionNewBalance =
      clientStore.transactionDetails.transactionCurrentBalance + clientStore.transactionDetails.transactionAmount
  }
}

const close = () => {
  emit('close', 'deposit')
}

async function onSubmit() {
  const toast = useToast()
  let transactionSuccess = false
  let accountUpdateSuccess = false
  const transaction = {
    clientId: authStore.client.id,
    transactionType: 'Deposit',
    amount: parseInt(clientStore.transactionDetails.transactionAmount),
    accountId: clientStore.transactionDetails.transactionAccountId,
    recipientAccountId: clientStore.transactionDetails.recipientAccountId,
    state: 'Approved'
  }
  const account = {
    balance: clientStore.transactionDetails.transactionNewBalance
  }

  try {
    // Post new transaction
    await clientStore.newTransaction(transaction)
      .then(() => {
        transactionSuccess = true
        toast.success('Deposit posted successfully.')
      })
      .catch((error) => {
        console.log('Error on deposit: ' + error)
        toast.error('Error making a new deposit.')
      })
    // Update account balance
    await clientStore.editAccount(clientStore.transactionDetails.transactionAccountId, account)
      .then(() => {
        accountUpdateSuccess = true
        toast.success('Account balance updated successfully.')
      })
      .catch((error) => {
        console.log('Error on account update: ' + error)
        toast.error('Error updating account details')
      })
    if (transactionSuccess && accountUpdateSuccess) {
      emit('close', 'newTransaction')
    }
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <div>
    <Form @submit="onSubmit" :validation-schema="schema" v-slot="{ errors, isSubmitting }">
      <!-- Account select -->
      <div class='row'>
        <div class='col mb-2'>
          <div class='d-flex flex-column align-items-start'>
            <label class='ms-1'>Choose your account</label>
            <div class='row'>
              <div class='col'>
                <div class='d-flex flex-column'>
                  <Field
                    name="depositAccount"
                    type="select"
                    v-slot="{ depositAccountField }"
                    :value="clientStore.transactionDetails.transactionAccountId"
                    class='me-2'>
                    <select
                      v-bind="depositAccountField"
                      class='form-control'
                      name='depositAccount'
                      :class="{ 'is-invalid': errors.depositAccount }"
                      :value="clientStore.transactionDetails.transactionAccountId"
                      @change="(e) => handleChange(e.target.name, e.target.value)"
                    >
                      <option selected disabled value='DEFAULT'>-- Select your account -- </option>
                      <option v-for="(account, index) in this.clientStore.accounts" :key='index'
                        :value="account.id">{{account.name}}
                      </option>
                    </select>
                  </Field>
                  <div class="invalid-feedback d-flex justify-content-start ms-1">{{ errors.depositAccount }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Current balance -->
      <div class='row' v-show='clientStore.transactionDetails.transactionCurrentBalance !== null' >
        <div class='col-8 mb-2'>
          <div class='d-flex align-items-start'>
            <label class='ms-1'>Current balance:</label>
            <span class='ms-1 fs-6 fw-bold'>${{ clientStore.transactionDetails.transactionCurrentBalance }}.00</span>
          </div>
        </div>
      </div>
      <!-- Deposit amount -->
      <div class='row'>
        <div class='col-8 mb-2'>
          <div class='d-flex flex-column align-items-start'>
            <label class='ms-1'>Deposit amount</label>
            <Field
              class="form-control"
              name="depositAmount"
              type="number"
              :value="clientStore.transactionDetails.transactionAmount!==null ? clientStore.transactionDetails.transactionAmount : 0.00"
              min=0
              :class="{ 'is-invalid': errors.depositAmount }"
              @change="(e) => handleChange(e.target.name, e.target.value)"
            />
            <div class="invalid-feedback d-flex justify-content-start ms-1">{{ errors.depositAmount }}</div>
          </div>
        </div>
      </div>
      <!-- New balance -->
      <div class='row' v-show='clientStore.transactionDetails.transactionNewBalance !== null' >
        <div class='col-8 mb-2'>
          <div class='d-flex align-items-start'>
            <label class='ms-1'>New balance:</label>
            <span class='ms-1 fs-6 fw-bold'>${{ clientStore.transactionDetails.transactionNewBalance }}.00</span>
          </div>
        </div>
      </div>
      <!-- Buttons -->
      <div class='row'>
        <div class='col-12'>
          <div class="d-flex justify-content-center form-group mt-4">
            <button class="btn btn-success me-3 ps-4 pe-4" type='submit' :disabled="isSubmitting">
              <span v-show="isSubmitting" class="spinner-border spinner-border-sm mr-1"></span>
              Submit
            </button>
            <button class="btn btn-secondary me-3 ps-4 pe-4" type='button' @click='close'>
              Close
            </button>
          </div>
        </div>
      </div>
    </Form>
  </div>
</template>
