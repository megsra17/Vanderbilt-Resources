<script setup>
import { ref, defineEmits } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const router = useRouter() // ✅ Get the router instance
const emit = defineEmits(['loading', 'submit', 'forgot'])

const user = ref({ email: '', password: '' })
const loading = ref(false)
const error = ref(null)

// Handle login
const login = async (event) => {
  if (event) event.preventDefault() // Prevent duplicate form submissions

  loading.value = true
  emit('loading', true)
  error.value = null

  try {
    await authStore.login(user.value, router) //Ensure this only runs once
    // Emit only if necessary
    emit('submit', { user: authStore.user })
    // Redirect to the home page after successful login
    router.push('/') // Or use: router.push('/')
  } catch (err) {
    error.value = err.message || 'Invalid email or password.'
    console.error('🚨 Login failed:', err.message)
  } finally {
    loading.value = false
    emit('loading', false)
  }
}
</script>

<template>
  <form @submit.prevent="login">
    <!-- Prevent form resubmission -->
    <div>
      <div v-if="error" class="alert alert-danger">{{ error }}</div>
      <div class="mb-3">
        <label class="form-label">Username</label>
        <input
          v-model="user.email"
          type="email"
          class="form-control"
          placeholder="Enter email"
          required
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Password</label>
        <input
          v-model="user.password"
          type="password"
          class="form-control"
          placeholder="Enter password"
          required
        />
      </div>

      <button class="btn ever-btn-primary w-100" :disabled="loading">
        {{ loading ? 'Logging in...' : 'Log In' }}
      </button>
      <p class="mt-3">
        <!-- <a href="#" @click.prevent="emit('forgot')">Forgot Password</a> -->
        <br />
        <a
          href="mailto:amanda.aloy@evergladesboats.com?subject=Request%20Everglades%20Resources%20Access&amp;body="
          >Need Access? Request Here</a
        >
      </p>
    </div>
  </form>
</template>
