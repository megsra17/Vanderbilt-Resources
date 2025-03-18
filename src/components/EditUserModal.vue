<template>
  <div class="modal d-block" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Edit User</h5>
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
          <!-- Edit Form -->
          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label for="name" class="form-label">Name</label>
              <input id="name" v-model="userForm.name" type="text" class="form-control" required />
            </div>
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input id="email" v-model="userForm.email" type="email" class="form-control" required />
            </div>
            <div class="mb-3">
              <label for="role" class="form-label">Role</label>
              <select id="role" v-model="userForm.role" class="form-select" required>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button type="submit" class="btn ever-btn-primary" :disabled="loading">
              {{ loading ? 'Updating User...' : 'Update User' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'
import axios from 'axios'

const props = defineProps({
  user: Object
})
const emit = defineEmits(['close', 'userUpdated'])

const userForm = ref({
  name: '',
  email: '',
  role: ''
})

const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

// Populate form when the passed user prop changes
watch(
  () => props.user,
  (newUser) => {
    if (newUser) {
      userForm.value = {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    }
  },
  { immediate: true }
)

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const handleSubmit = async () => {
  loading.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    const response = await axios.put(`${API_URL}/api/users/${props.user._id}`, userForm.value)
    successMessage.value = 'User updated successfully'
    emit('userUpdated', response.data.user)
    closeModal()
  } catch (error) {
    errorMessage.value = error.response?.data?.error || 'Error updating user'
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
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
