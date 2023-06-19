<template>
  <div class="dialog">
    <div class="center">
      <div class='col m-3'>
        <h3>Admin panel</h3>
        <p>{{ text }}</p>
        <div class='row mb-1'>
          <input type='password' name='admin-password' :value='this.password' @change='(e) => handleInput(e.target.value)'>
        </div>
        <div v-show='passError' class='mb-2 text-danger'>Invalid admin password!</div>
        <div class='row'>
          <div class='d-flex flex-row'>
            <button @click="checkPassword()" class="btn btn-success px-4"> Yes </button>
            <button @click="closeDialog(false)" class="btn btn-danger px-4"> No </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { closeDialog } from 'vue3-promise-dialog'

export default {
  props: {
    text: String
  },
  setup() {
    function returnValue() {
      return true
    }
    return {
      returnValue,
      closeDialog,
      defaultAdminPassword: 'BaninoAdmin123'
    }
  },
  methods: {
    checkPassword() {
      if (this.password === this.defaultAdminPassword) {
        closeDialog()
      } else {
        this.passError = true
      }
    },
    handleInput(value) {
      this.password = value
    }
  },
  data() {
    return {
      password: undefined,
      passError: false
    }
  }
}
</script>

<style scoped>
.dialog {
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 0.75rem;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}

.center {
  position: fixed;
  top: 50%;
  left: 50%;
  border-radius: 0.75rem;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 30px;
}

.btn {
  margin: 0.5rem 0.75rem;
}
</style>
