import { Dashboard, DashboardHome, Accounts, Transactions, Banino } from '@/views'

export default {
  path: '/dashboard',
  component: Dashboard,
  children: [
    { path: '', name: 'Dashboard', redirect: 'Dashboard' },
    { path: 'home', name: 'Dashboard', component: DashboardHome },
    { path: 'accounts', name: 'Accounts', component: Accounts },
    { path: 'transactions', name: 'Transactions', component: Transactions },
    { path: 'banino', name: 'Banino', component: Banino }
  ]
}
