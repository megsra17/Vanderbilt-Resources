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
  },

  actions: {
    async login({ email, password }) {
      console.log('🔹 Attempting login with:', email, password) // Debugging log

      if (!email || !password) {
        console.error('🚨 Error: Email or password is empty!')
        throw new Error('Email and password are required.')
      }

      // Simulated authentication (Replace with API call)
      if (email === 'test@example.com' && password === 'password123') {
        console.log('✅ Login successful!')
        this.user = { email, name: 'Test User' }
        this.token = 'dummy-token-123'
        localStorage.setItem('user', JSON.stringify(this.user))
        localStorage.setItem('token', this.token)
      } else {
        console.error('❌ Invalid credentials')
        throw new Error('Invalid email or password.')
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
