import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'), // Prevent JSON parsing errors
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
      } catch (error) {
        console.error('Login error:', error)
        throw new Error(error.response?.data?.error || 'Login failed.')
      }
    },

    async logout() {
      try {
        const useDummyAuth = true
        if (!useDummyAuth) {
          await axios.post('http://localhost:3001/api/users/logout')
        }
        this.user = null
        this.token = null
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      } catch (error) {
        console.error('Logout error:', error)
      }
    },

    // Send a password reset request (email-based)
    async sendResetRequest(email) {
      try {
        const response = await axios.post(
          'http://localhost:3001/api/users/reset-password-request',
          { email },
        )
        return response.data
      } catch (error) {
        console.error('Reset request error:', error)
        throw new Error(error.response?.data?.error || 'Reset request failed.')
      }
    },

    // Reset the password using the provided token and new password
    async resetPassword(token, newPassword) {
      try {
        const response = await axios.post('http://localhost:3001/api/users/reset-password', {
          token,
          newPassword,
        })
        return response.data
      } catch (error) {
        console.error('Reset password error:', error)
        throw new Error(error.response?.data?.error || 'Reset password failed.')
      }
    },

    // Optional: Verify the reset token without resetting the password
    async verifyResetToken(token) {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/users/verify-reset-token?token=${token}`,
        )
        return response.data
      } catch (error) {
        console.error('Verify token error:', error)
        throw new Error(error.response?.data?.error || 'Token verification failed.')
      }
    },
  },
})
