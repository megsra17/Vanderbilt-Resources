import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token') || null,
    // Read the token expiration from localStorage, if it exists.
    tokenExpires: localStorage.getItem('tokenExpires')
      ? parseInt(localStorage.getItem('tokenExpires'))
      : null,
  }),

  getters: {
    // Token is considered valid only if it exists and hasn't expired.
    isAuthenticated: (state) =>
      !!state.token && !!state.tokenExpires && Date.now() < state.tokenExpires,,
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

    // Send a password reset request (email-based)
    async sendResetRequest(email) {
      try {
        const response = await axios.post(`${API_URL}/api/users/reset-password-request`, { email })
        return response.data
      } catch (error) {
        console.error('Reset request error:', error)
        throw new Error(error.response?.data?.error || 'Reset request failed.')
      }
    },

    // Reset the password using the provided token and new password
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

    // Optional: Verify the reset token without resetting the password
    async verifyResetToken(token) {
      try {
        const response = await axios.get(`${API_URL}/api/users/verify-reset-token?token=${token}`)
        return response.data
      } catch (error) {
        console.error('Verify token error:', error)
        throw new Error(error.response?.data?.error || 'Token verification failed.')
      }
    },
  },
})
