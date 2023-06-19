import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import { router } from './router'
import BootstrapVue3 from 'bootstrap-vue-3'
import Toast from 'vue-toastification'
import { PromiseDialog } from 'vue3-promise-dialog'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import 'vue-toastification/dist/index.css'
import '@/assets/css/style.scss'

/* import the fontawesome core, component */
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faCircleUser,
  faBars,
  faHouseUser,
  faAddressBook,
  faHandHoldingUsd,
  faMoneyBillTransfer,
  faStar,
  faWallet,
  faRightLeft,
  faDice,
  faGear,
  faPlus,
  faPenToSquare,
  faXmark,
  faDownload,
  faUpload,
  faUsers
} from '@fortawesome/free-solid-svg-icons'
library.add(
  faCircleUser,
  faBars,
  faHouseUser,
  faAddressBook,
  faHandHoldingUsd,
  faMoneyBillTransfer,
  faStar,
  faWallet,
  faRightLeft,
  faDice,
  faGear,
  faPlus,
  faPenToSquare,
  faXmark,
  faDownload,
  faUpload,
  faUsers
)
const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
const toastOptions = {
  // Toast options to be added here
  position: 'bottom-right',
  timeout: 2000,
  maxToasts: 5,
  newestOnTop: true
}
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(BootstrapVue3)
app.use(Toast, toastOptions)
app.use(PromiseDialog)
app.config.productionTip = false
app.use(router)

app.mount('#app')
