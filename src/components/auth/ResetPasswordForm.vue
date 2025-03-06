<template>
  <div class="reset-password">
    <h2>Reset Your Password</h2>
    <div v-if="errorMessage" class="alert alert-danger">
      {{ errorMessage }}
    </div>
    <div v-if="successMessage" class="alert alert-success">
      {{ successMessage }}
    </div>
    <form @submit.prevent="handleReset">
      <div class="mb-3">
        <label for="newPassword" class="form-label">New Password</label>
        <input
          id="newPassword"
          type="password"
          v-model="newPassword"
          class="form-control"
          required
        />
      </div>
      <div class="mb-3">
        <label for="confirmPassword" class="form-label">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          v-model="confirmPassword"
          class="form-control"
          required
        />
      </div>
      <button type="submit" class="btn ever-btn-primary w-100" :disabled="loading">
        {{ loading ? 'Resetting...' : 'Reset Password' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const newPassword = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const handleReset = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match!'
    return
  }

  // Get the token from query params
  const token = route.query.key
  if (!token) {
    errorMessage.value = 'Invalid or missing token!'
    return
  }

  loading.value = true
  try {
    await authStore.resetPassword(token, newPassword.value)
    successMessage.value = 'Password reset successfully! Redirecting to login...'
    // Optionally, redirect to login after a short delay
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (error) {
    console.error('Reset password error:', error)
    errorMessage.value = error.response?.data?.error || 'Failed to reset password.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.reset-password {
  max-width: 400px;
  margin: 2rem auto;
  padding: 1rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>
