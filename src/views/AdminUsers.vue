<!-- src/views/AdminUsers.vue -->
<template>
  <div class="admin-users container my-4">
    <h2>Manage Users</h2>
    
    <!-- Add New User Button -->
    <button class="btn ever-btn-primary mb-3" @click="showAddUserModal = true">
      Add New User
    </button>

    <!-- Success and error messages for overall operations -->
    <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
    <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
    
    <!-- Users Table -->
    <div class="table-responsive">
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
              <button class="btn ever-btn-secondary me-2 mb-3 mb-lg-0" @click="openEditUserModal(user)">Edit</button>
              <button class="btn ever-btn-primary" @click="deleteUser(user._id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add User Modal Component -->
    <AddUserModal 
      v-if="showAddUserModal" 
      @close="showAddUserModal = false" 
      @userAdded="handleUserAdded" 
    />

    <!-- Edit User Modal Component -->
    <EditUserModal
      v-if="showUserModal"
      :user="editingUser"
      @close="showUserModal = false"
      @userUpdated="handleUserUpdated"
    />

    <!-- Backdrop for modals -->
    <div v-if="showAddUserModal || showUserModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import AddUserModal from '@/components/AddUser.vue'
import EditUserModal from '@/components/EditUserModal.vue'

const users = ref([])
const errorMessage = ref('')
const successMessage = ref('')
const showAddUserModal = ref(false)
const showUserModal = ref(false) // For edit modal
const editingUser = ref(null)

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/users`)
    users.value = response.data.users
  } catch (error) {
    errorMessage.value = error.response?.data?.error || 'Error fetching users'
  }
}

onMounted(() => {
  fetchUsers()
})

// Handle new user addition
const handleUserAdded = (newUser) => {
  fetchUsers()
  successMessage.value = `User ${newUser.name} added successfully`
}

// Open the edit modal with the selected user's data
const openEditUserModal = (user) => {
  editingUser.value = user
  showUserModal.value = true
}

// Handle updated user
const handleUserUpdated = (updatedUser) => {
  fetchUsers()
  successMessage.value = `User ${updatedUser.name} updated successfully`
}

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
