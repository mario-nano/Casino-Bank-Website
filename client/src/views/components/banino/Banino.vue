<script setup>
import { ref, defineEmits, defineProps } from 'vue'
import { Roulette } from 'vue3-roulette'
import { useAuthStore, useClientStore } from '@/stores'
import { useToast } from 'vue-toastification'
import { Form, Field } from 'vee-validate'
import * as Yup from 'yup'
const wheel = ref(null)
defineEmits(['wheel-start', 'wheel-end'])
const props = defineProps(['onWheel-start', 'onWheel-end'])

const clientStore = useClientStore()
const authStore = useAuthStore()
const baninoErrors = {
  resetDone: true,
  errors: false,
  baninoAmountError: 'You cannot bet more than current balance!',
  baninoProps: props
}

const prizes = [
  {
    id: 1,
    type: 'multiply',
    value: 1,
    htmlContent: '1x',
    textColor: '#ffffff',
    background: '#33cc33'
  },
  {
    id: 2,
    type: 'plus',
    value: 500,
    htmlContent: '$500',
    textColor: '#ffffff',
    background: '#ff5500'
  },
  {
    id: 3,
    type: 'multiply',
    value: 2,
    htmlContent: '2x',
    textColor: '#ffffff',
    background: '#00f'
  },
  {
    id: 4,
    type: 'bankrupt',
    value: 0,
    htmlContent: 'Bankrupt',
    textColor: '#ffffff',
    background: '#000'
  },
  {
    id: 5,
    type: 'multiply',
    value: 3,
    htmlContent: '3x',
    textColor: '#ffffff',
    background: '#33cc33'
  },
  {
    id: 6,
    type: 'plus',
    value: 1000,
    htmlContent: '$1000',
    textColor: '#000',
    background: '#ff0'
  },
  {
    id: 7,
    type: 'multiply',
    value: 2,
    htmlContent: '2x',
    textColor: '#ffffff',
    background: '#00f'
  },
  {
    id: 8,
    type: 'bankrupt',
    value: 0,
    htmlContent: 'Bankrupt',
    textColor: '#ffffff',
    background: '#000'
  },
  {
    id: 10,
    type: 'plus',
    value: 100,
    htmlContent: '$100',
    textColor: '#ffffff',
    background: '#33cc33'
  },
  {
    id: 11,
    type: 'jackpot',
    value: 20,
    htmlContent: 'Jackpot<br />20x',
    textColor: '#ffffff',
    background: '#f00'
  },
  {
    id: 12,
    type: 'plus',
    value: 100,
    htmlContent: '$100',
    textColor: '#ffffff',
    background: '#00f'
  },
  {
    id: 13,
    type: 'bankrupt',
    value: 0,
    htmlContent: 'Bankrupt',
    textColor: '#fff',
    background: '#000'
  }
]
const schema = Yup.object().shape({
  withdrawAccount: Yup.string()
    .required('Account needs to be selected')
    .test(
      'Please select account',
      'Please select account',
      () => clientStore.transactionDetails.transactionAccountId !== 'DEFAULT'
    )
    .nullable(),
  withdrawAmount: Yup.string().test(
    'Withdrawal amount must be positive',
    'Amount must be more than 0.00 and less than current balance.',
    () =>
      clientStore.transactionDetails.transactionAmount > 0 &&
      clientStore.transactionDetails.transactionAmount <=
      clientStore.transactionDetails.transactionCurrentBalance &&
      Number.isInteger(clientStore.transactionDetails.transactionAmount)
  ),
  newBalance: Yup.string().test(
    'New balance must be $0 or more.',
    'New balance must be $0 or more.',
    () => clientStore.transactionDetails.transactionNewBalance >= 0
  )
})

const handleChange = (field, value) => {
  if (field === 'withdrawAccount') {
    clientStore.transactionDetails.transactionAccountId = value
    const depositAccount = clientStore.accounts.find(
      (account) => account.id === value.toString()
    )
    clientStore.transactionDetails.transactionCurrentBalance = depositAccount.balance
  } else if (field === 'withdrawAmount') {
    clientStore.transactionDetails.transactionAmount = parseInt(value)
  }
  if (clientStore.transactionDetails.transactionCurrentBalance !== null) {
    clientStore.transactionDetails.transactionNewBalance =
      clientStore.transactionDetails.transactionCurrentBalance -
      clientStore.transactionDetails.transactionAmount
  }

  if (clientStore.transactionDetails.transactionNewBalance < 0) {
    baninoErrors.errors = true
  } else {
    baninoErrors.errors = false
  }
}

async function beforeSpin() {
  const toast = useToast()
  if (clientStore.transactionDetails.transactionAccountId !== 'DEFAULT' &&
    clientStore.transactionDetails.transactionAmount !== null &&
    !baninoErrors.errors
  ) {
    wheel.value.launchWheel()
  } else if (clientStore.transactionDetails.transactionAccountId === 'DEFAULT' ||
    clientStore.transactionDetails.transactionAmount === null) {
    toast.error('Please choose your account and bet', { timeout: 3500 })
  } else if (baninoErrors.errors) {
    toast.error('Please correct your bet or select a different account', { timeout: 3500 })
  }
}

async function afterSpin(prize) {
  if (baninoErrors.resetDone) {
    baninoErrors.resetDone = false
    const toast = useToast()
    let transactionSuccess = false
    let accountUpdateSuccess = false
    let transactionType = ''

    if (prize) {
      if (prize.type === 'jackpot') {
        clientStore.transactionDetails.transactionAmount =
          clientStore.transactionDetails.transactionAmount * 10
        clientStore.transactionDetails.transactionNewBalance =
          clientStore.transactionDetails.transactionCurrentBalance +
          clientStore.transactionDetails.transactionAmount
        transactionType = 'Banino win'
      } else if (prize.type === 'multiply') {
        clientStore.transactionDetails.transactionAmount =
          clientStore.transactionDetails.transactionAmount * prize.value
        clientStore.transactionDetails.transactionNewBalance =
          clientStore.transactionDetails.transactionCurrentBalance +
          clientStore.transactionDetails.transactionAmount
        transactionType = 'Banino win'
      } else if (prize.type === 'plus') {
        clientStore.transactionDetails.transactionAmount =
          clientStore.transactionDetails.transactionAmount + prize.value
        clientStore.transactionDetails.transactionNewBalance =
          clientStore.transactionDetails.transactionCurrentBalance +
          clientStore.transactionDetails.transactionAmount
        transactionType = 'Banino win'
      } else if (prize.type === 'bankrupt') {
        clientStore.transactionDetails.transactionNewBalance =
          clientStore.transactionDetails.transactionCurrentBalance -
          clientStore.transactionDetails.transactionAmount
        transactionType = 'Banino loss'
      }
    }
    const transaction = {
      clientId: authStore.client.id,
      transactionType: transactionType,
      amount: parseInt(clientStore.transactionDetails.transactionAmount),
      accountId: clientStore.transactionDetails.transactionAccountId,
      recipientAccountId: clientStore.transactionDetails.recipientAccountId,
      state: 'Approved'
    }
    const account = {
      balance: clientStore.transactionDetails.transactionNewBalance
    }

    try {
      await clientStore
        .newTransaction(transaction)
        .then(() => {
          transactionSuccess = true
          if (prize.type === 'bankrupt') {
            transaction.transactionType = 'Banino loss'
            toast.warning('Sorry. You have lost $' + parseInt(clientStore.transactionDetails.transactionAmount))
          } else {
            transaction.transactionType = 'Banino win'
            toast.success('Congrats! You have won $' + parseInt(clientStore.transactionDetails.transactionAmount))
          }
        })
        .catch((error) => {
          console.log('Error on deposit: ' + error)
          toast.error('Error making a new deposit.')
        })
      await clientStore
        .editAccount(clientStore.transactionDetails.transactionAccountId, account)
        .then(() => {
          accountUpdateSuccess = true
          toast.success('Account balance updated successfully.')
        })
        .catch((error) => {
          console.log('Error on account update: ' + error)
          toast.error('Error updating account details')
        })
      if (transactionSuccess && accountUpdateSuccess) {
        wheel.value.reset()
        clientStore.resetTransactionInterim()
      }
    } catch (error) {
      console.log(error)
    }
  } else {
    setTimeout(resetWheel, 3000)
  }
}

function resetWheel() {
  wheel.value.reset()
  clientStore.resetTransactionInterim()
  clientStore.getAllAccounts(authStore.client.id)
  baninoErrors.resetDone = true
}
</script>

<template>
  <div>
    <div class='m-3'>
      <h4>Banino game</h4>
      <h5 class='text-start'>Choose an account to place your bet:</h5>
      <div class='container'>
        <Form @submit="() => { return false }" :validation-schema="schema" v-slot="{ errors }">
          <div class="row">
            <div class="col mb-2">
              <div class="d-flex flex-column align-items-start">
                <div class="d-flex flex-column">
                  <Field
                    type="select"
                    name="withdrawAccount"
                    v-slot="{ withdrawAccountField }"
                    :value="clientStore.transactionDetails.transactionAccountId"
                    class="me-2"
                  >
                    <select
                      v-bind="withdrawAccountField"
                      class="form-control"
                      name="withdrawAccount"
                      :class="{ 'is-invalid': errors.withdrawAccount }"
                      :value="clientStore.transactionDetails.transactionAccountId"
                      @change="(e) => handleChange(e.target.name, e.target.value)"
                    >
                      <option selected disabled value="DEFAULT">
                        -- Select your account --
                      </option>
                      <option
                        v-for="(account, index) in this.clientStore.accounts"
                        :key="index"
                        :value="account.id"
                      >
                        {{ account.name }}
                      </option>
                    </select>
                  </Field>
                  <div class="invalid-feedback text-start ms-1">
                    {{ errors.withdrawAccount }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row" v-show="clientStore.transactionDetails.transactionCurrentBalance !== null">
            <div class='col'>
              <div class="d-flex align-items-start">
                <label class="ms-1">Current balance:</label>
                <span class="ms-1 fs-6 fw-bold">
                  ${{ clientStore.transactionDetails.transactionCurrentBalance }}.00
                </span>
              </div>
            </div>
          </div>
          <div class="row d-flex justify-content-center mt-3"
               v-show="clientStore.transactionDetails.transactionAccountId !== 'DEFAULT'">
            <h5 v-show="clientStore.transactionDetails.transactionAccountId !== 'DEFAULT'">Choose your bet:</h5>
            <div class='d-flex justify-content-center'
                 v-show="clientStore.transactionDetails.transactionAccountId !== 'DEFAULT'"
            >
              <button
                v-show='clientStore.transactionDetails.transactionCurrentBalance > 100'
                class="btn btn-outline-success me-2"
                @click="() => handleChange('withdrawAmount', 100)">
                $100
              </button>
              <button
                v-show='clientStore.transactionDetails.transactionCurrentBalance > 500'
                class="btn btn-outline-success me-2"
                @click="() => handleChange('withdrawAmount', 500)">
                $500
              </button>
              <button
                v-show='clientStore.transactionDetails.transactionCurrentBalance > 1000'
                class="btn btn-outline-success me-2"
                @click="() => handleChange('withdrawAmount', 1000)">
                $1000
              </button>
              <button
                v-show='clientStore.transactionDetails.transactionCurrentBalance > 2500'
                class="btn btn-outline-success me-2"
                @click="() => handleChange('withdrawAmount', 2500)">
                $2500
              </button>
              <button
                v-show='clientStore.transactionDetails.transactionCurrentBalance > 5000'
                class="btn btn-outline-success me-2"
                @click="() => handleChange('withdrawAmount', 5000)">
                $5000
              </button>
              <button
                v-show='clientStore.transactionDetails.transactionCurrentBalance > 5000'
                class="btn btn-outline-success me-2"
                @click="() => handleChange('withdrawAmount', clientStore.transactionDetails.transactionCurrentBalance)">
                All-in!!!
              </button>
            </div>
            <div class='col-xl-3 col-lg-3 col-md-6 col-sm-12 mb-2'
                 v-show="clientStore.transactionDetails.transactionAccountId !== 'DEFAULT'">
              <label class="ms-1">or enter desired amount:</label>
              <Field
                v-slot="{ baninoAmountField }"
                class="form-control"
                name="withdrawAmount"
                type="number"
                :value="clientStore.transactionDetails.transactionAmount"
                min="0"
                :class="{ 'is-invalid': errors.withdrawAmount }"
                @change="(e) => handleChange(e.target.name, e.target.value)">
                <input
                  class="form-control"
                  v-bind="baninoAmountField"
                  type='number'
                  name='withdrawAmount'
                  :value='clientStore.transactionDetails.transactionAmount'
                  @change="(e) => handleChange(e.target.name, e.target.value)"
                >
              </Field>
              <div class="invalid-feedback text-start ms-1">
                {{ errors.withdrawAmount }}
              </div>
            </div>
          </div>
          <div v-show='baninoErrors.errors === true' class='text-danger'>
            {{ baninoErrors.baninoAmountError }}
          </div>
          <div class="row">
            <div class="col-12">
              <div class="d-flex justify-content-center form-group mt-4">
                <Roulette
                  ref="wheel"
                  :items="prizes"
                  :display-border="true"
                  :display-shadow="true"
                  :centered-indicator="true"
                  :result-variation="100"
                  :duration="6"
                  :display-indicator="true"
                  easing="bounce"
                  @click="beforeSpin"
                  @wheel-start="() => {return false}"
                  @wheel-end="afterSpin"
                />
              </div>
              <button :disabled='!baninoErrors.resetDone' class='btn btn-outline-success btn-lg mt-3' @click="beforeSpin">
                <span v-show='!baninoErrors.resetDone'>Resetting ...</span>
                <span v-show='baninoErrors.resetDone'>SPIN!</span>
              </button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>
