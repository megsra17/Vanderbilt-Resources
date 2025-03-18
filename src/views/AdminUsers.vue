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
            <button class="btn ever-btn-primary " @click="deleteUser(user._id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Existing modal for editing a user (if applicable) -->
    <div v-if="showUserModal" class="modal d-block" tabindex="-1">
      <!-- Edit User Modal content goes here -->
    </div>

    <!-- Add User Modal Component -->
    <AddUserModal 
      v-if="showAddUserModal" 
      @close="showAddUserModal = false" 
      @userAdded="handleUserAdded" 
    />

    <!-- Backdrop for modal -->
    <div v-if="showAddUserModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import AddUserModal from '@/components/AddUser.vue'

// Reactive variables
const users = ref([])
const errorMessage = ref('')
const successMessage = ref('')
const showAddUserModal = ref(false)
const showUserModal = ref(false) // For edit modal, if used

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// Fetch users from the backend
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
  // Option 1: Refresh the whole list
  fetchUsers()
  // Option 2: Simply push the new user into the local users array
  // users.value.push(newUser)
  successMessage.value = `User ${newUser.name} added successfully`
}
  
// Other methods for editing and deleting users...
const openEditUserModal = (user) => {
  // Your logic for opening the edit modal
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
