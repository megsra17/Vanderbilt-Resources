<template>
  <!-- WRAP everything in a parent container so we can have a top bar above the nav -->
  <div>
    <div class="container-fluid border-bottom py-2" style="background-color: #fff">
      <div class="row align-items-center">
        <!-- Left side: Logo -->
        <div class="col-6 d-flex align-items-center">
          <a href="/">
            <img src="@/images/Nauticstar-Blue-Logo.jpg" alt="Everglades Logo" height="40" />
          </a>
        </div>
        <div class="col-6 text-end">
          <a
            class="fw-bold me-lg-3"
            target="_blank"
            href="https://wakeeffects.com/collections/shop-by-brand-nauticstar"
          >
            Dealer Appeal
          </a>
          <a
            v-if="authStore.isAdmin"
            class="badge rounded-pill ever-bg-secondary text-decoration-none"
            href="/users"
          >
            Manage Users
          </a>
        </div>
      </div>
    </div>

    <!-- MAIN NAVBAR (Navy background) -->
    <nav v-if="!isAdminPage" class="navbar navbar-expand-lg ever-bg-primary">
      <div class="container-fluid">
        <!-- Mobile Toggle Button -->
        <button class="navbar-toggler text-white" type="button" @click="mobileOpen = !mobileOpen">
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Navbar Links: Center items using justify-content-center -->
        <div class="collapse navbar-collapse justify-content-center" :class="{ show: mobileOpen }">
          <ul class="navbar-nav text-white">
            <!-- Model Year -->
            <li class="nav-item dropdown" @mouseenter="menuOver('years')" @mouseleave="menuLeave">
              <a
                class="nav-link dropdown-toggle fs-5 text-white"
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

            <!-- Boat Model  -->
             <li class="nav-item dropdown px-lg-4" @mouseenter="menuOver('boats')" @mouseleave="menuLeave">
              <a
                class="nav-link dropdown-toggle fs-5 text-white"
                href="#"
                role="button"
                @click.prevent="menuClick('boats')"
              >
                {{ menuStore.active.boat ? menuStore.active.boat.name : 'Boat Model' }}
              </a>

              <!-- Manual 5-column layout -->
              <ul
                class="dropdown-menu width-container p-3"
                :class="{ show: active === 'boats' }"
              >
                <div class="row">
                  <!-- Column 1: Bay Boats -->
                  <div class="col-12 col-lg-2">
                    <li class="dropdown-header">Bay Boats</li>
                    <li v-for="boat in bayBoats" :key="boat.key">
                      <a
                        class="dropdown-item"
                        href="#"
                        @click.prevent="menuStore.setFilter('boat', boat)"
                      >
                        {{ boat.name }}
                      </a>
                    </li>
                  </div>

                  <!-- Column 2: Deck Boats -->
                  <div class="col-12 col-lg-2">
                    <li class="dropdown-header">Deck Boats</li>
                    <li v-for="boat in deckBoats" :key="boat.key">
                      <a
                        class="dropdown-item"
                        href="#"
                        @click.prevent="menuStore.setFilter('boat', boat)"
                      >
                        {{ boat.name }}
                      </a>
                    </li>
                  </div>

                  <!-- Column 3: Hybrid Boats -->
                  <div class="col-12 col-lg-2">
                    <li class="dropdown-header">Hybrid Boats</li>
                    <li v-for="boat in hybridBoats" :key="boat.key">
                      <a
                        class="dropdown-item"
                        href="#"
                        @click.prevent="menuStore.setFilter('boat', boat)"
                      >
                        {{ boat.name }}
                      </a>
                    </li>
                  </div>

                  <!-- Column 4: Legacy Boats -->
                  <div class="col-12 col-lg-2">
                    <li class="dropdown-header">Legacy Boats</li>
                    <li v-for="boat in legacyBoats" :key="boat.key">
                      <a
                        class="dropdown-item"
                        href="#"
                        @click.prevent="menuStore.setFilter('boat', boat)"
                      >
                        {{ boat.name }}
                      </a>
                    </li>
                  </div>

                  <!-- Column 5: Offshore Boats -->
                  <div class="col-12 col-lg-2">
                    <li class="dropdown-header">Offshore Boats</li>
                    <li v-for="boat in offshoreBoats" :key="boat.key">
                      <a
                        class="dropdown-item"
                        href="#"
                        @click.prevent="menuStore.setFilter('boat', boat)"
                      >
                        {{ boat.name }}
                      </a>
                    </li>
                  </div>
                </div>
              </ul>
            </li>

            <!-- Resource Type -->
            <li
              class="nav-item dropdown pe-lg-4"
              @mouseenter="menuOver('types')"
              @mouseleave="menuLeave"
            >
              <a
                class="nav-link dropdown-toggle fs-5 text-white"
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
            <li class="nav-item text-white pe-lg-4">
              <router-link class="nav-link text-white fs-5" to="/" @click="closeMenu"
                >Reset Filter</router-link
              >
            </li>

            <!-- Authentication Section -->
            <li class="nav-item" v-if="!authStore.isAuthenticated">
              <router-link class="nav-link text-white fs-5" to="/login">Login</router-link>
            </li>
            <li class="nav-item" v-else>
              <a class="nav-link text-white fs-5" href="#" @click.prevent="logout">Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<style scoped>
.navbar-toggler-icon {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='rgba(255,255,255,1)' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 7h22M4 15h22M4 23h22'/%3E%3C/svg%3E");
}

.width-container{
  width: 900px; 
  max-height: 400px; 
  overflow-y: auto;
}

.nav-link{
  font-family: 'Oxanium', sans-serif !important;
}

/* Optional: Adjust for smaller screens (use one column) */
@media (max-width: 576px) {
  .width-container{
  width: 400px; 
}
}
</style>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMenuStore } from '@/stores/useMenuStore' // Import Pinia store
import { useAuthStore } from '@/stores/authStore' // Import auth store
import { useRoute } from 'vue-router'

const menuStore = useMenuStore()
const authStore = useAuthStore()
const active = ref(null)
const userOpen = ref(false)
const mobileOpen = ref(false)

// Computed properties for Pinia state
const activeMenu = computed(() => active.value)

// Get the current route
const route = useRoute()

// Compute a flag to determine if we are on the admin page
const isAdminPage = computed(() => route.path === '/users')

const bayBoats = computed(() =>
  menuStore.menu.boats.filter((boat) => {
    // check if boat.name includes "Bay" or ends with "Bay".
    return boat.name.includes("Bay")
  })
)

const deckBoats = computed(() =>
  menuStore.menu.boats.filter((boat) => {
    // If last word is "DC" or "SC"
    const lastWord = boat.name.split(" ").pop()
    return lastWord === "DC" || lastWord === "SC"
  })
)

const hybridBoats = computed(() =>
  menuStore.menu.boats.filter((boat) => boat.name.includes("Hybrid"))
)

const legacyBoats = computed(() =>
  menuStore.menu.boats.filter((boat) => boat.name.includes("Legacy"))
)

const offshoreBoats = computed(() =>
  menuStore.menu.boats.filter((boat) => {
    // If last word is "OS" or "OSL"
    const lastWord = boat.name.split(" ").pop()
    return lastWord === "OS" || lastWord === "OSL"
  })
)

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
