<template>
  <nav class="navbar navbar-expand-lg">
    <div class="container">
      <!-- Logo -->
      <router-link class="navbar-brand" to="/">
        <img src="@/images/logo.svg" alt="Logo" height="40" />
      </router-link>

      <!-- Mobile Toggle Button -->
      <button class="navbar-toggler" type="button" @click="mobileOpen = !mobileOpen">
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Navbar Links -->
      <div class="collapse navbar-collapse" :class="{ show: mobileOpen }">
        <ul class="navbar-nav ms-auto">
          <!-- Model Year -->
          <li class="nav-item dropdown" @mouseenter="menuOver('years')" @mouseleave="menuLeave">
            <a
              class="nav-link dropdown-toggle"
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
              class="nav-link dropdown-toggle"
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
              class="nav-link dropdown-toggle"
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
          <li class="nav-item">
            <router-link class="nav-link" to="/" @click="closeMenu">Reset Filter</router-link>
          </li>

          <!-- 🔒 Authentication Section -->
          <li class="nav-item" v-if="!menuStore.isAuthenticated">
            <router-link class="nav-link" to="/login">Login</router-link>
          </li>
          <li class="nav-item dropdown" v-else>
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              @click.prevent="userOpen = !userOpen"
            >
              Test User
              <!-- {{ menuStore.user.name || 'Account' }} -->
            </a>
            <ul class="dropdown-menu" v-if="userOpen">
              <li>
                <router-link class="dropdown-item" to="/profile" @click="closeMenu"
                  >Profile</router-link
                >
              </li>
              <li>
                <a class="dropdown-item" href="#" @click.prevent="logout">Logout</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMenuStore } from '@/stores/useMenuStore' // Import Pinia store

const menuStore = useMenuStore()

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

// Logout user
const logout = () => {
  menuStore.logout()
  closeMenu()
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
