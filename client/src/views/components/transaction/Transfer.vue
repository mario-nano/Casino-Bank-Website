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
  transferAccount: Yup.string()
    .required('Account needs to be selected')
    .test(
      'Please select account',
      'Please select account',
      () => clientStore.transactionDetails.transactionAccountId !== 'DEFAULT')
    .nullable(),
  recipientAccount: Yup.string()
    .required('Account needs to be selected')
    .test(
      'Please select account',
      'Please select account',
      () => clientStore.transactionDetails.transactionRecipientAccountId !== 'DEFAULT')
    .nullable(),
  transferAmount: Yup.string()
    .test(
      'Transfer amount must be positive',
      'Amount must be more than 0.00 and less than current balance.',
      () => (clientStore.transactionDetails.transactionAmount > 0 &&
        clientStore.transactionDetails.transactionAmount <= clientStore.transactionDetails.transactionCurrentBalance &&
        Number.isInteger(clientStore.transactionDetails.transactionAmount))
    ),
  newBalance: Yup.string()
    .test(
      'New balance must be $0 or more.',
      'New balance must be $0 or more.',
      () => (clientStore.transactionDetails.transactionNewBalance >= 0)
    )
})

const handleChange = (field, value) => {
  if (field === 'transferAccount') {
    clientStore.transactionDetails.transactionAccountId = value
    clientStore.transactionDetails.transactionRecipientAccountId = 'DEFAULT'
    const account = clientStore.accounts.find(account => account.id === (value).toString())
    clientStore.transactionDetails.transactionCurrentBalance = account.balance
    clientStore.transactionDetails.transactionRecipientCurrentBalance = null
  } if (field === 'recipientAccount') {
    clientStore.transactionDetails.transactionRecipientAccountId = value
    const account = clientStore.accounts.find(account => account.id === (value).toString())
    clientStore.transactionDetails.transactionRecipientCurrentBalance = account.balance
  } else if (field === 'transferAmount') {
    clientStore.transactionDetails.transactionAmount = parseInt(value)
  }
  // Calculate new balance
  if (clientStore.transactionDetails.transactionCurrentBalance !== null) {
    clientStore.transactionDetails.transactionNewBalance =
      clientStore.transactionDetails.transactionCurrentBalance - clientStore.transactionDetails.transactionAmount
    clientStore.transactionDetails.transactionRecipientNewBalance =
      clientStore.transactionDetails.transactionRecipientCurrentBalance + clientStore.transactionDetails.transactionAmount
  }
}

const close = () => {
  emit('close', 'transfer')
}

async function onSubmit() {
  const toast = useToast()
  let transactionSuccess = false
  let accountUpdateSuccess = false
  const transaction = {
    clientId: authStore.client.id,
    transactionType: 'Transfer',
    amount: parseInt(clientStore.transactionDetails.transactionAmount),
    accountId: clientStore.transactionDetails.transactionAccountId,
    recipientAccountId: clientStore.transactionDetails.transactionRecipientAccountId,
    state: 'Approved'
  }
  const transferAccount = {
    balance: clientStore.transactionDetails.transactionNewBalance
  }

  const recipientAccount = {
    balance: clientStore.transactionDetails.transactionRecipientNewBalance
  }

  try {
    // Post new transaction
    await clientStore.newTransaction(transaction)
      .then(() => {
        transactionSuccess = true
        toast.success('Transfer made successfully.')
      })
      .catch((error) => {
        console.log('Error on transfer: ' + error)
        toast.error('Error making a new transfer.')
      })
    // Update transfer account balance
    await clientStore.editAccount(clientStore.transactionDetails.transactionAccountId, transferAccount)
      .then(() => {
        accountUpdateSuccess = true
      })
      .catch((error) => {
        console.log('Error on account update: ' + error)
        accountUpdateSuccess = false
        toast.error('Error updating account details')
      })
    // Update recipient account balance
    await clientStore.editAccount(clientStore.transactionDetails.transactionRecipientAccountId, recipientAccount)
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
      <!-- Transferring account select -->
      <div class='row'>
        <div class='col mb-2'>
          <div class='d-flex flex-column align-items-start'>
            <label class='ms-1'>Account to transfer from</label>
            <div class='row'>
              <div class='col'>
                <div class='d-flex flex-column'>
                  <Field
                    name="transferAccount"
                    type="select"
                    v-slot="{ transferAccountField }"
                    :value="clientStore.transactionDetails.transactionAccountId"
                    class='me-2'>
                    <select
                      v-bind="transferAccountField"
                      class='form-control'
                      name='transferAccount'
                      :class="{ 'is-invalid': errors.transferAccount }"
                      :value="clientStore.transactionDetails.transactionAccountId"
                      @change="(e) => handleChange(e.target.name, e.target.value)"
                    >
                      <option selected disabled value='DEFAULT'>-- Select your account -- </option>
                      <option v-for="(account, index) in this.clientStore.accounts" :key='index'
                        :value="account.id">{{account.name}}
                      </option>
                    </select>
                  </Field>
                  <div class="invalid-feedback text-start ms-1">{{ errors.transferAccount }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Receiving account select -->
      <div class='row' v-show="clientStore.transactionDetails.transactionAccountId !=='DEFAULT'">
        <div class='col mb-2'>
          <div class='d-flex flex-column align-items-start'>
            <label class='ms-1'>Account to transfer into</label>
            <div class='row'>
              <div class='col'>
                <div class='d-flex flex-column'>
                  <Field
                    name="recipientAccount"
                    type="select"
                    v-slot="{ recipientAccountField }"
                    :value="clientStore.transactionDetails.transactionRecipientAccountId"
                    class='me-2'>
                    <select
                      v-bind="recipientAccountField"
                      class='form-control'
                      name='recipientAccount'
                      :class="{ 'is-invalid': errors.recipientAccount }"
                      :value="clientStore.transactionDetails.transactionRecipientAccountId"
                      @change="(e) => handleChange(e.target.name, e.target.value)"
                    >
                      <option selected disabled value='DEFAULT'>-- Select your account -- </option>
                      <option v-for="(account, index) in this.clientStore.accounts"
                              v-show="account.id !== clientStore.transactionDetails.transactionAccountId"
                              :key='index'
                              :value="account.id">{{account.name}}
                      </option>
                    </select>
                  </Field>
                  <div class="invalid-feedback text-start ms-1">{{ errors.recipientAccount }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Transferring account balance -->
      <div class='row' v-show='clientStore.transactionDetails.transactionCurrentBalance !== null' >
        <div class='col-8 mt-2 mb-1'>
          <div class='d-flex align-items-start'>
            <label class='ms-1'>Transferring account balance:</label>
            <span class='ms-1 fs-6 fw-bold'>${{ clientStore.transactionDetails.transactionCurrentBalance }}.00</span>
          </div>
        </div>
      </div>
      <!-- Receiving account balance -->
      <div class='row' v-show='clientStore.transactionDetails.transactionRecipientCurrentBalance !== null' >
        <div class='col-8 mb-2'>
          <div class='d-flex align-items-start'>
            <label class='ms-1'>Recipient account balance:</label>
            <span class='ms-1 fs-6 fw-bold'>${{ clientStore.transactionDetails.transactionRecipientCurrentBalance }}.00</span>
          </div>
        </div>
      </div>
      <!-- Transfer amount -->
      <div class='row'>
        <div class='col-8 mb-2'>
          <div class='d-flex flex-column align-items-start'>
            <label class='ms-1'>Transfer amount</label>
            <Field
              class="form-control"
              name="transferAmount"
              type="number"
              :value="clientStore.transactionDetails.transactionAmount!==null ? clientStore.transactionDetails.transactionAmount : 0.00"
              min=0
              :class="{ 'is-invalid': errors.transferAmount }"
              @change="(e) => handleChange(e.target.name, e.target.value)"
            />
            <div class="invalid-feedback text-start ms-1">{{ errors.transferAmount }}</div>
          </div>
        </div>
      </div>
      <!-- New transfer account balance -->
      <div class='row' v-show='clientStore.transactionDetails.transactionNewBalance !== null' >
        <div class='col-8 mb-2'>
          <div class='d-flex flex-column align-items-start'>
            <div class='d-flex flex-row'>
              <label class='ms-1 text-start'>Transferring account new balance:</label>
              <div class='text-start ms-1 fs-6 fw-bold' :class="{ 'is-invalid': errors.newBalance }">${{ clientStore.transactionDetails.transactionNewBalance }}.00</div>
            </div>
            <div v-show='clientStore.transactionDetails.transactionNewBalance < 0' class="text-danger text-small text-start ms-1">{{ errors.newBalance }}</div>
          </div>
        </div>
      </div>
      <!-- New recipient account balance -->
      <div class='row' v-show="clientStore.transactionDetails.transactionRecipientNewBalance !== null && clientStore.transactionDetails.transactionRecipientAccountId !== 'DEFAULT'" >
        <div class='col-8 mb-2'>
          <div class='d-flex flex-column align-items-start'>
            <div class='d-flex flex-row'>
              <label class='ms-1 text-start'>Recipient account new balance:</label>
              <div class='text-start ms-1 fs-6 fw-bold'>${{ clientStore.transactionDetails.transactionRecipientNewBalance }}.00</div>
            </div>
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
