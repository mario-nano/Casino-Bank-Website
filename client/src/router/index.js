import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores'
import { Dashboard } from '@/views'
import adminRoutes from './admin.routes'
import clientRoutes from './client.routes'
import publicRoutes from './public.routes'

export const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  linkActiveClass: 'active',
  routes: [
    { path: '/', component: Dashboard },
    { ...adminRoutes },
    { ...clientRoutes },
    { ...publicRoutes },
    // Catch all redirect to home page
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
})

router.beforeEach(async (to) => {
  // redirect to login page if public is not logged in
  const publicPages = ['/public/login', '/public/register', '/public/about']
  const authRequired = !publicPages.includes(to.path)
  const authStore = useAuthStore()

  if (authRequired && !authStore.isLoggedIn) {
    authStore.returnUrl = to.fullPath
    return '/public/about'
  }
})
