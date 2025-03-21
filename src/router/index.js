import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'
import LoginView from '../views/Login.vue'
import AddUser from '@/components/AddUser.vue'
import AdminUsers from '@/views/AdminUsers.vue'
import ResetPasswordForm from '@/components/auth/ResetPasswordForm.vue'
import { useMenuStore } from '@/stores/useMenuStore' // Import Pinia store

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }, // 🔒 Protected route
    },
    {
      path: '/users',
      name: 'users',
      component: AdminUsers,
      meta: { requiresAuth: true }, // 🔒 Protected route
    },
    { path: '/reset-password', component: ResetPasswordForm },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
  ],
})

// 🔒 Navigation Guard (Redirect Unauthenticated Users)
router.beforeEach((to, from, next) => {
  const menuStore = useMenuStore()

  // If user is authenticated and is trying to access the login page, redirect to home
  if (to.path === '/login' && menuStore.isAuthenticated) {
    return next('/')
  }

  // If the route requires auth and the user is not authenticated, redirect to login
  if (to.meta.requiresAuth && !menuStore.isAuthenticated) {
    return next('/login')
  }

  next()
})

export default router
