<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const email = ref('')
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const sendResetRequest = async () => {
  loading.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    await authStore.sendResetRequest(email.value)
    successMessage.value = 'Reset email sent! Check your inbox.'
  } catch (error) {
    console.error('Error sending reset request:', error)
    errorMessage.value = error.response?.data?.error || 'Failed to send reset email.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="reset-form">
    <h2>Reset Password</h2>

    <div v-if="successMessage" class="alert alert-success">
      {{ successMessage }}
    </div>
    <div v-if="errorMessage" class="alert alert-danger">
      {{ errorMessage }}
    </div>

    <form @submit.prevent="sendResetRequest">
      <div class="mb-3">
        <label for="resetEmail" class="form-label">Email Address</label>
        <input
          id="resetEmail"
          v-model="email"
          type="email"
          class="form-control"
          placeholder="Enter your email"
          required
        />
      </div>
      <button type="submit" class="btn btn-primary w-100" :disabled="loading">
        {{ loading ? 'Sending...' : 'Send Reset Link' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.reset-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>
