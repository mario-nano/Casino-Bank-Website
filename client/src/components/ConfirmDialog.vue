<template>
  <div class="dialog">
    <div class="center">
      <p>{{ text }}</p>
      <button @click="closeDialog()" class="btn btn-success px-4"> Yes </button>
      <button @click="closeDialog(false)" class="btn btn-danger px-4"> No </button>
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
      closeDialog
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
