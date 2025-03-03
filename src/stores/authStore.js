import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'), // ✅ Prevent JSON parsing errors
    token: localStorage.getItem('token') || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => state.user,
    userRole: (state) => (state.user ? state.user.role : 'viewer'),
    isAdmin: (state) => state.user && state.user.role === 'admin',
  },

  actions: {
    async login({ email, password }) {
      console.log('🔹 Attempting login with:', email, password)

      if (!email || !password) {
        console.error('🚨 Error: Email or password is empty!')
        throw new Error('Email and password are required.')
      }

      try {
        const response = await axios.post('http://localhost:3001/api/users/login', {
          email,
          password,
        })
        const { user, token } = response.data
        this.user = user
        this.token = token
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('token', token)
        console.log('✅ Login successful!')
      } catch (error) {
        console.error('Login error:', error)
        throw new Error(error.response?.data?.error || 'Login failed.')
      }
    },

    async logout() {
      try {
        console.log('🔴 Logging out...')
        const useDummyAuth = true
        if (!useDummyAuth) {
          await axios.post('/json/logout')
        }

        this.user = null
        this.token = null
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        console.log('✅ Successfully logged out!')
      } catch (error) {
        console.error('Logout error:', error)
      }
    },
  },
})
