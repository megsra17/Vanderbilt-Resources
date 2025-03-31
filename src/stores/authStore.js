import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// Immediately clear expired tokens from localStorage on load.
const storedTokenExpires = localStorage.getItem('tokenExpires')
if (storedTokenExpires && Date.now() > parseInt(storedTokenExpires)) {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  localStorage.removeItem('tokenExpires')
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token') || null,
    tokenExpires: localStorage.getItem('tokenExpires')
      ? parseInt(localStorage.getItem('tokenExpires'))
      : null,
  }),

  getters: {
    // Token is valid only if it exists and hasn't expired.
    isAuthenticated: (state) =>
      !!state.token && !!state.tokenExpires && Date.now() < state.tokenExpires,
    getUser: (state) => state.user,
    userRole: (state) => (state.user ? state.user.role : 'user'),
    isAdmin: (state) => state.user && state.user.role === 'admin',
  },

  actions: {
    async login({ email, password }) {
      if (!email || !password) {
        console.error('🚨 Error: Email or password is empty!')
        throw new Error('Email and password are required.')
      }
      try {
        const response = await axios.post(`${API_URL}/api/users/login`, {
          email,
          password,
        })
        const { user, token } = response.data
        this.user = user
        this.token = token
        // Set expiration: 25 hours from now.
        const expiresAt = Date.now() + 25 * 3600 * 1000
        this.tokenExpires = expiresAt

        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('token', token)
        localStorage.setItem('tokenExpires', expiresAt.toString())

        // Set a timer to auto-logout when the token expires.
        const remainingTime = expiresAt - Date.now()
        setTimeout(() => {
          // Double-check that the token hasn't been refreshed.
          if (Date.now() >= this.tokenExpires) {
            this.logout()
          }
        }, remainingTime)
      } catch (error) {
        console.error('Login error:', error)
        throw new Error(error.response?.data?.error || 'Login failed.')
      }
    },

    async logout() {
      try {
        const useDummyAuth = true
        if (!useDummyAuth) {
          await axios.post(`${API_URL}/api/users/logout`)
        }
        this.user = null
        this.token = null
        this.tokenExpires = null
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        localStorage.removeItem('tokenExpires')
      } catch (error) {
        console.error('Logout error:', error)
      }
    },

    async sendResetRequest(email) {
      try {
        const response = await axios.post(`${API_URL}/api/users/reset-password-request`, { email })
        return response.data
      } catch (error) {
        console.error('Reset request error:', error)
        throw new Error(error.response?.data?.error || 'Reset request failed.')
      }
    },

    async resetPassword(token, newPassword) {
      try {
        const response = await axios.post(`${API_URL}/api/users/reset-password`, {
          token,
          newPassword,
        })
        return response.data
      } catch (error) {
        console.error('Reset password error:', error)
        throw new Error(error.response?.data?.error || 'Reset password failed.')
      }
    },

    async verifyResetToken(token) {
      try {
        const response = await axios.get(`${API_URL}/api/users/verify-reset-token?token=${token}`)
        return response.data
      } catch (error) {
        console.error('Verify token error:', error)
        throw new Error(error.response?.data?.error || 'Token verification failed.')
      }
    },

    // Optional: Action to manually check token expiration.
    checkTokenExpiration() {
      if (this.tokenExpires && Date.now() >= this.tokenExpires) {
        this.logout()
      }
    },
  },
})
