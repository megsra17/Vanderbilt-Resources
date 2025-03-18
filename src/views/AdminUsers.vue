<template>
  <div class="admin-users container my-4">
    <h2>Manage Users</h2>

    <!-- Display error or success messages -->
    <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
    <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>

    <!-- Users Table -->
    <table class="table table-bordered table-hover">
      <thead>
        <tr>
          <th>Email</th>
          <th>Name</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user._id">
          <td>{{ user.email }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.role }}</td>
          <td>
            <button class="btn ever-btn-secondary me-2" @click="openEditUserModal(user)">Edit</button>
            <button class="btn ever-btn-primary" @click="deleteUser(user._id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Add/Edit User Modal -->
    <div v-if="showUserModal" class="modal d-block" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editingUser ? 'Edit User' : 'Add New User' }}</h5>
            <button type="button" class="btn-close" @click="closeUserModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitUserForm">
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input v-model="userForm.email" type="email" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Name</label>
                <input v-model="userForm.name" type="text" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Role</label>
                <select v-model="userForm.role" class="form-select" required>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
              <div v-if="!editingUser" class="mb-3">
                <label class="form-label">Password</label>
                <input v-model="userForm.password" type="password" class="form-control" required />
              </div>
              <button type="submit" class="btn btn-primary">
                {{ editingUser ? 'Update User' : 'Create User' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
    <!-- Backdrop for modal -->
    <div v-if="showUserModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

// Ensure only admin can access this page
if (!authStore.isAdmin) {
  router.push('/')
}

const users = ref([])
const errorMessage = ref('')
const successMessage = ref('')
const showUserModal = ref(false)
const editingUser = ref(null)

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// Initialize form data for add/edit
const userForm = ref({
  email: '',
  name: '',
  role: 'user',
  password: ''
})

// Fetch users from backend API
const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/users`)
    users.value = response.data.users
  } catch (error) {
    errorMessage.value = error.response?.data?.error || 'Error fetching users'
    console.error('Fetch error:', error)
  }
}


onMounted(() => {
  fetchUsers()
})

// Open modal for adding new user
const openAddUserModal = () => {
  editingUser.value = null
  userForm.value = { email: '', name: '', role: 'user', password: '' }
  showUserModal.value = true
}

// Open modal for editing a user
const openEditUserModal = (user) => {
  editingUser.value = user
  userForm.value = { ...user, password: '' } // leave password empty for editing
  showUserModal.value = true
}

// Close modal
const closeUserModal = () => {
  showUserModal.value = false
}

// Submit add/edit user form
const submitUserForm = async () => {
  try {
    if (editingUser.value) {
      // Update existing user
      await axios.put(`${API_URL}/api/users/${editingUser.value._id}`, userForm.value)
      successMessage.value = 'User updated successfully'
    } else {
      // Create new user
      await axios.post(`${API_URL}/api/users/register`, userForm.value)
      successMessage.value = 'User created successfully'
    }
    closeUserModal()
    fetchUsers()  // refresh user list
  } catch (error) {
    errorMessage.value = error.response?.data?.error || 'Error saving user'
  }
}

// Delete user
const deleteUser = async (userId) => {
  if (confirm('Are you sure you want to delete this user?')) {
    try {
      await axios.delete(`${API_URL}/api/users/${userId}`)
      successMessage.value = 'User deleted successfully'
      fetchUsers()
    } catch (error) {
      errorMessage.value = error.response?.data?.error || 'Error deleting user'
    }
  }
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
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1040;
}
</style>
