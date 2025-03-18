<script setup>
import NavBar from '@/views/NavBar.vue'
import { useAuthStore } from '@/stores/authStore.js' // Authentication store
import { computed } from 'vue'

const authStore = useAuthStore()

// Computed property to check authentication status
const isAuthenticated = computed(() => authStore.isAuthenticated)
</script>

<template>
  <div class="full-height-layout">
    <!-- Show NavBar only if authenticated -->
    <NavBar v-if="isAuthenticated" @switch-view="switchToImages" />

    <!-- Dynamic Content -->
    <main class="main-content">
      <RouterView />
    </main>

    <!-- Optional Footer -->
    <footer class="ever-bg-primary text-white text-center py-3">
      <div class="row">
        <div class="col-lg-6">
          <p class="mb-0">© 2025 NauticStar Boats. All rights reserved.</p>
        </div>
        <div class="col-lg-6">
          <p class="mb-0"><a class="text-white" href="https://nauticstarboats.com/privacy-policy/">Privacy Policy</a> | <a href="https://nauticstarboats.com/terms-of-use/" class="text-white">Terms of Use</a> | <a class="text-white" href="https://nauticstarboats.com/website-accessibility-statement/">Accessibility</a> | <a href="https://nauticstarboats.com/po-terms-conditions/" class="text-white"> Terms &Conditions</a> </p>
        </div>
      </div>
      
    </footer>
  </div>
</template>

<style>
.full-height-layout {
  min-height: 100vh; /* Ensure full screen height */
  display: flex;
  flex-direction: column;
}


.main-content {
  flex: 1; /* Ensures dynamic content takes up remaining space */
  display: flex;
  flex-direction: column;
  padding: 20px; /* Add padding for spacing */
}
</style>
