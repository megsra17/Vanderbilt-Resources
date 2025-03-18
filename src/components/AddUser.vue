<!-- src/components/AddUserModal.vue -->
<template>
  <div class="modal d-block" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add New User</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
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
              </select>
            </div>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{ loading ? 'Adding User...' : 'Add User' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
import axios from 'axios'

const emit = defineEmits(['userAdded', 'close'])

const name = ref('')
const email = ref('')
const password = ref('')
const role = ref('user')
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

// Use your environment variable for the API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const handleSubmit = async () => {
  loading.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    const response = await axios.post(`${API_URL}/api/users/register`, {
      name: name.value,
      email: email.value,
      password: password.value,
      role: role.value,
    })
    successMessage.value = `User ${response.data.user.name} added successfully`
    // Emit an event so the parent can update the users list
    emit('userAdded', response.data.user)
    // Optionally clear form fields
    name.value = ''
    email.value = ''
    password.value = ''
    role.value = 'user'
    closeModal() // Close modal after success
  } catch (error) {
    console.error('Registration error:', error)
    errorMessage.value = error.response?.data?.error || 'Failed to add user.'
  } finally {
    loading.value = false
  }
}

const closeModal = () => {
  emit('close')
}
</script>

<style scoped>
.modal {
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
