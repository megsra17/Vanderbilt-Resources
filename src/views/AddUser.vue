<template>
  <div class="admin-add-user">
    <h2>Add New User</h2>
    
    <!-- Success and error messages -->
    <div v-if="successMessage" class="alert alert-success">
      {{ successMessage }}
    </div>
    <div v-if="errorMessage" class="alert alert-danger">
      {{ errorMessage }}
    </div>
    
    <!-- Registration Form -->
    <form @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label for="name" class="form-label">Name</label>
        <input
          id="name"
          v-model="name"
          type="text"
          class="form-control"
          placeholder="Enter user's name"
          required
        />
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          class="form-control"
          placeholder="Enter user's email"
          required
        />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input
          id="password"
          v-model="password"
          type="password"
          class="form-control"
          placeholder="Enter password"
          required
        />
      </div>
      <div class="mb-3">
        <label for="role" class="form-label">Role</label>
        <select id="role" v-model="role" class="form-select">
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <!-- You can add other roles as needed -->
        </select>
      </div>
      <button type="submit" class="btn ever-btn-secondary" :disabled="loading">
        {{ loading ? 'Adding User...' : 'Add User' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import axios from 'axios'

const authStore = useAuthStore()
const router = useRouter()

// Check if the current user is an admin; if not, redirect away.
onMounted(() => {
  if (!authStore.isAdmin) {
    router.push('/')
  }
})

// Form fields and state
const name = ref('')
const email = ref('')
const password = ref('')
const role = ref('user')
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

// Use an environment variable for the API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const handleSubmit = async () => {
  loading.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    // Call the registration endpoint to create a new user
    const response = await axios.post(`${API_URL}/api/users/register`, {
      name: name.value,
      email: email.value,
      password: password.value,
      role: role.value,
    })
    successMessage.value = `User ${response.data.user.name} added successfully`
    
    // Clear the form fields after successful registration
    name.value = ''
    email.value = ''
    password.value = ''
    role.value = 'user'
  } catch (error) {
    console.error('Registration error:', error)
    errorMessage.value = error.response?.data?.error || 'Failed to add user.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.admin-add-user {
  max-width: 75%;
  margin: 2rem auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>
