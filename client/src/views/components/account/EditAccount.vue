<script setup>
import { defineProps, defineEmits } from 'vue'
import { useClientStore } from '@/stores'
import { useToast } from 'vue-toastification'
import { Form, Field } from 'vee-validate'
import * as Yup from 'yup'

const clientStore = useClientStore()
const emit = defineEmits(['close'])

defineProps({
  editId: String,
  balance: Number,
  accountName: String
})

const schema = Yup.object().shape({
  accountType: Yup.string()
    .test(
      'Account type is required',
      'Account type cannot be empty',
      () => clientStore.editAccountDetails.accountType !== ''),
  accountName: Yup.string()
    .test(
      'Account name is required',
      'Account name cannot be empty',
      () => clientStore.editAccountDetails.name !== '')
})

function handleChange(field, value) {
  clientStore.editAccountDetails[field] = value
}

function closeModal() {
  emit('close', 'editAccount')
}

async function onSubmit(values) {
  const toast = useToast()
  let accountSuccess = false
  const account = {
    name: clientStore.editAccountDetails.name,
    accountType: clientStore.editAccountDetails.accountType
  }

  try {
    await clientStore.editAccount(clientStore.editAccountDetails.id, account)
      .then(() => {
        accountSuccess = true
        toast.success('Account updated successfully.')
      })
      .catch((error) => {
        console.log('Error on account update: ' + error)
        toast.error('Error updating account details')
      })
    if (accountSuccess) {
      emit('close', 'editAccount')
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
                <div class='d-flex flex-row'>
                  <Field
                    name="accountType"
                    type="radio"
                    value="Checking"
                    :checked="clientStore.editAccountDetails.accountType === 'Checking'"
                    v-slot="{ accountTypeField }"
                    class='me-2'>
                    <input
                      v-bind="accountTypeField"
                      name='accountName'
                      type="radio"
                      value="Checking"
                      :checked="clientStore.editAccountDetails.accountType === 'Checking'"
                      :class="{ 'is-invalid': errors.accountType }"
                      @change="(e) => handleChange('accountType', e.target.value)"
                      class='me-2'
                    />
                  </Field>
                  Checking
                </div>
                <div class='d-flex flex-row'><Field
                  name="accountType"
                  type="radio"
                  value="Saving"
                  :checked="clientStore.editAccountDetails.accountType === 'Saving'"
                  v-slot="{ accountTypeField }"
                  class='me-2'>
                  <input
                    v-bind="accountTypeField"
                    name='accountName'
                    type="radio"
                    value="Saving"
                    :checked="clientStore.editAccountDetails.accountType === 'Saving'"
                    :class="{ 'is-invalid': errors.accountType }"
                    @change="(e) => handleChange('accountType', e.target.value)"
                    class='me-2'
                  />
                </Field>
                  Saving</div>
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
            <Field name='accountName' :value="clientStore.editAccountDetails.name" v-slot="{ accountNameField }" type="text">
              <input
                v-bind="accountNameField"
                name='accountName'
                class='form-control'
                type="text"
                :value="clientStore.editAccountDetails.name"
                :class="{ 'is-invalid': errors.accountName }"
                @change="(e) => handleChange('name', e.target.value)"
              />
            </Field>
            <div class="invalid-feedback d-flex justify-content-start ms-1">{{ errors.accountName }}</div>
          </div>
        </div>
      </div>
      <!-- Account balance -->
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
                :value="clientStore.editAccountDetails.balance" />
            </Field>
            <p class='text-start fs-6 text-small'>* Cannot edit balance. You need to make transactions.</p>
          </div>
        </div>
      </div>
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
