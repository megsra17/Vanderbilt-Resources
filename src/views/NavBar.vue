<template>
  <!-- WRAP everything in a parent container so we can have a top bar above the nav -->
  <div>
    <!-- TOP BAR (White background) -->
    <div
      class="d-flex justify-content-between align-items-center px-4 py-2"
      style="background-color: #fff; border-bottom: 1px solid #ddd"
    >
      <!-- Left side: Logo + "Built For Beyond" -->
      <div class="d-flex align-items-center">
        <!-- Swap in your actual Everglades logo if desired -->
       <a href="/"> <img src="@/images/Nauticstar-Blue-Logo.jpg" alt="Everglades Logo" height="40" /></a>
      </div>

      <!-- Right side: "Dealer Appeal & POS Materials" -->
      <div class="d-flex align-items-center">
        <a
          class="fw-bold me-3"
          target="_blank"
          href="https://wakeeffects.com/collections/shop-by-brand-nauticstar"
          >Dealer Appeal</a
        ><span></span>
        <a class="badge rounded-pill bg-warning text-dark text-decoration-none" href="/add-user">Add New User</a>
      </div>
    </div>

    <!-- MAIN NAVBAR (Navy background) -->
    <nav class="navbar navbar-expand-lg" style="background-color: #0b2349">
      <div class="container-fluid">
        <!-- Mobile Toggle Button -->
        <button class="navbar-toggler text-white" type="button" @click="mobileOpen = !mobileOpen">
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Navbar Links (unchanged from your code) -->
        <div class="collapse navbar-collapse" :class="{ show: mobileOpen }">
          <ul class="navbar-nav ms-auto text-white">
            <!-- Model Year -->
            <li class="nav-item dropdown" @mouseenter="menuOver('years')" @mouseleave="menuLeave">
              <a
                class="nav-link dropdown-toggle text-white"
                href="#"
                role="button"
                @click.prevent="menuClick('years')"
              >
                {{ menuStore.active.year ? menuStore.active.year.year : 'Model Year' }}
              </a>
              <ul class="dropdown-menu" :class="{ show: active === 'years' }">
                <li v-for="(year, index) in menuStore.menu.years" :key="index">
                  <a
                    class="dropdown-item"
                    href="#"
                    @click.prevent="menuStore.setFilter('year', year)"
                  >
                    {{ year.year }}
                  </a>
                </li>
              </ul>
            </li>

            <!-- Boat Model -->
            <li class="nav-item dropdown" @mouseenter="menuOver('boats')" @mouseleave="menuLeave">
              <a
                class="nav-link dropdown-toggle text-white"
                href="#"
                role="button"
                @click.prevent="menuClick('boats')"
              >
                {{ menuStore.active.boat ? menuStore.active.boat.name : 'Boat Model' }}
              </a>
              <ul class="dropdown-menu" :class="{ show: active === 'boats' }">
                <li v-for="(boat, index) in menuStore.menu.boats" :key="index">
                  <a
                    class="dropdown-item"
                    href="#"
                    @click.prevent="menuStore.setFilter('boat', boat)"
                  >
                    {{ boat.name }}
                  </a>
                </li>
              </ul>
            </li>

            <!-- Resource Type -->
            <li class="nav-item dropdown" @mouseenter="menuOver('types')" @mouseleave="menuLeave">
              <a
                class="nav-link dropdown-toggle text-white"
                href="#"
                role="button"
                @click.prevent="menuClick('types')"
              >
                {{ menuStore.active.type ? menuStore.active.type.name : 'Resource Type' }}
              </a>
              <ul class="dropdown-menu" :class="{ show: active === 'types' }">
                <li v-for="(type, index) in menuStore.menu.types" :key="index">
                  <a
                    class="dropdown-item"
                    href="#"
                    @click.prevent="menuStore.setFilter('type', type)"
                  >
                    {{ type.name }}
                  </a>
                </li>
              </ul>
            </li>

            <!-- Reset Filter -->
            <li class="nav-item text-white">
              <router-link class="nav-link text-white" to="/" @click="closeMenu"
                >Reset Filter</router-link
              >
            </li>
            <!-- 🔒 Authentication Section -->
            <li class="nav-item" v-if="!authStore.isAuthenticated">
              <router-link class="nav-link text-white" to="/login">Login</router-link>
            </li>
            <li class="nav-item" v-else>
              <a class="nav-link text-white" href="#" @click.prevent="logout">Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMenuStore } from '@/stores/useMenuStore' // Import Pinia store
import { useAuthStore } from '@/stores/authStore' // Import auth store

const menuStore = useMenuStore()
const authStore = useAuthStore()
const active = ref(null)
const userOpen = ref(false)
const mobileOpen = ref(false)

// Computed properties for Pinia state
const activeMenu = computed(() => active.value)

onMounted(() => {
  console.log('Menu Data:', menuStore.menu)
  console.log('Active Year:', menuStore.active.year)
})

/** Hover Methods for Navbar */
const menuOver = (menuItem) => {
  active.value = menuItem // Ensure state is updating
}

const menuLeave = () => {
  if (active.value) {
    active.value = null // Only update if active is defined
  }
}

const menuClick = (menuItem) => {
  active.value = active.value === menuItem ? null : menuItem
}

// Close menus after selecting an item
const closeMenu = () => {
  active.value = null
  mobileOpen.value = false
  userOpen.value = false
  menuStore.active = {
    // Reset active menu to default values
    year: menuStore.menu.years.length ? menuStore.menu.years[0] : { key: '', year: 'Unknown' },
    boat: menuStore.menu.boats.length ? menuStore.menu.boats[0] : { key: '', name: 'Unknown' },
    type: menuStore.menu.types.length ? menuStore.menu.types[0] : { key: '', name: 'Unknown' },
  }
}

const logout = () => {
  authStore.logout() // Use the auth store's logout method
  closeMenu()
  window.location.reload()
}

// Email contact link
const contactLink = computed(() => {
  return `mailto:amanda.aloy@evergladesboats.com?subject=${encodeURIComponent(
    'Everglades Resources Contact Request',
  )}`
})

// Define getRoute to generate route paths dynamically
const getRoute = (type, key) => {
  return `/${type}/${key}`
}
</script>
