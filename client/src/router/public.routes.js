import { PublicLayout, Login, Register, Introduction } from '@/views'

export default {
  path: '/public',
  component: PublicLayout,
  children: [
    { path: '', redirect: 'about' },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'about', component: Introduction }
  ]
}
