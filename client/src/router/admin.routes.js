import {
  Dashboard,
  AdminHome,
  Clients
} from '@/views'

export default {
  path: '/admin',
  component: Dashboard,
  children: [
    { path: '', name: 'AdminStart', redirect: 'Admin' },
    { path: 'panel', name: 'Admin', component: AdminHome },
    { path: 'clients', name: 'Clients', component: Clients }
  ]
}
