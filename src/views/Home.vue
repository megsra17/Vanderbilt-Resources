<template>
  <not-found-content v-if="notFound"></not-found-content>
  <div class="home" v-else>
    <!-- Hero Section -->
    <div
      class="lazy-background login-background p-5"
      :style="{ backgroundImage: `url(${backgroundImage})` }"
    >
      <div class="hero-inner text-start text-white">
        <h1>Dealer<br />Resources</h1>
        <div class="separator w-25"></div>
      </div>
    </div>

    <!-- Contact & Sales Info -->
    <div class="container py-4">
      <div class="row">
        <!-- Sales & Servicing -->
        <div class="col-lg-4 col-md-6 mb-4">
          <h4 class="fw-bold">Sales & Servicing</h4>
          <p>
            If you require dealer net price sheets, please reach out to your Everglades Director of
            Business Development.
          </p>
        </div>

        <!-- Northeast & Southeast Contacts -->
        <div class="col-lg-4 col-md-6 mb-4">
          <h5 class="fw-bold">Northeast</h5>
          <p>
            Caroline Cozier-Rainis - Director of Business Development<br />
            <a href="tel:5165216596" class="text-decoration-none">516.521.6596</a> |
            <a :href="getContactLink('caroline@evergladesboats.com')" class="text-decoration-none">
              caroline@evergladesboats.com
            </a>
          </p>
          <h5 class="fw-bold mt-3">Southeast</h5>
          <p>
            Matt Holloway - Director of Business Development<br />
            <a href="tel:8044131553" class="text-decoration-none">804.413.1553</a> |
            <a
              :href="getContactLink('matt.holloway@evergladesboats.com')"
              class="text-decoration-none"
            >
              matt.holloway@evergladesboats.com
            </a>
          </p>
        </div>

        <!-- Press Contact -->
        <div class="col-lg-4 col-md-12 mb-4">
          <h4 class="fw-bold">Press Contact</h4>
          <p>Everglades is enthusiastic to provide media and press assets.</p>
          <p>
            <b>Amanda Aloy</b> - Marketing Manager<br />
            <a href="tel:3864160432" class="text-decoration-none">386.416.0432</a> |
            <a
              :href="getContactLink('amanda.aloy@evergladesboats.com')"
              class="text-decoration-none"
            >
              amanda.aloy@evergladesboats.com
            </a>
          </p>
        </div>
      </div>
    </div>

    <!-- Breadcrumbs & Resources (for non-home routes) -->
    <div v-if="$route.fullPath !== '/'">
      <div class="container">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <router-link to="/" class="text-decoration-none">Home</router-link>
            </li>
            <li
              v-for="(breadcrumb, index) in breadcrumbs"
              :key="index"
              class="breadcrumb-item"
            >
              <router-link :to="breadcrumb.path" class="text-decoration-none">
                {{ breadcrumb.name }}
              </router-link>
            </li>
          </ol>
        </nav>

        <!-- Title & Pagination -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h1 class="boat-title">{{ title }}</h1>
          <pagination v-model="page" :total="total"></pagination>
        </div>

        <!-- Category Filters -->
        <div class="mb-3">
          <router-link
            key="filter-all"
            :to="getRoute('category', null)"
            class="btn btn-outline-primary me-2"
          >
            All
          </router-link>
          <span v-for="(c, index) in categories" :key="'filter-' + c.id">
            <router-link :to="getRoute('category', c.key)" class="btn btn-outline-secondary me-2">
              {{ c.name }}
            </router-link>
          </span>
        </div>

        <!-- Resource Panels -->
        <div class="row" v-if="resources.length > 0">
          <div class="col-lg-12 mb-4" v-for="(row, c) in resources" :key="c">
            <div class="card p-3">
              <h2 class="fw-bold">{{ row.name }}</h2>
              <div class="d-flex flex-wrap">
                <resource-panel
                  v-for="(item, index) in row.resources"
                  :key="item.id"
                  :resource="item"
                ></resource-panel>
              </div>
            </div>
          </div>
        </div>

        <!-- No Resources Message -->
        <div v-if="resources.length === 0" class="alert alert-warning text-center">
          We're sorry, but there were no resources found for the criteria you requested.
          <router-link to="/" class="alert-link">Go Home?</router-link>
        </div>

        <!-- Pagination (Bottom) -->
        <div class="d-flex justify-content-between align-items-center mt-4">
          <h1 class="boat-title"></h1>
          <pagination v-model="page" :total="total"></pagination>
        </div>
      </div>
    </div>

    <!-- Gallery Section for Cloudinary Images -->
    <div class="container py-4">
      <!-- Display the active folder if available -->
      <div v-if="menuStore.active.year && menuStore.active.boat" class="mb-3">
        <h5>
          Currently viewing folder:
          <strong>
            nauticstar/{{ menuStore.active.year.key }}/{{ menuStore.active.boat.key }}
          </strong>
        </h5>
      </div>
      <h2 class="boat-title">Gallery</h2>
      <div v-if="menuStore.loading" class="text-center">
        Loading images...
      </div>
      <div v-else class="row">
        <div
          v-for="(img, index) in menuStore.images"
          :key="index"
          class="col-md-3 mb-4 text-center"
        >
          <div class="d-flex flex-column align-items-center">
            <img
              :src="img.url"
              :alt="img.alt"
              class="img-fluid"
              style="object-fit: cover;"
            />
            <!-- Display the title (use display_name or a title property) -->
            <h5 class="mt-2">{{ img.display_name || img.alt }}</h5>
            <a
              :href="img.url.replace('/upload/', '/upload/fl_attachment/')"
              download
              class="btn btn-sm btn-primary mt-2"
            >
              Download
            </a>
          </div>
        </div>
        <div v-if="menuStore.images.length === 0" class="alert alert-warning text-center">
          No images found.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useMenuStore } from '@/stores/useMenuStore'
import { useRouter, useRoute } from 'vue-router'
import backgroundImage from '@/images/main-image.webp'

// Initialize Pinia Store and Router
const menuStore = useMenuStore()
const router = useRouter()
const route = useRoute()

// Local reactive state
const resources = ref([])
const categories = ref([])
const page = ref(1)
const total = ref(0)
const notFound = ref(false)

// Email helper functions for contact and calendar links
const getContactLink = (email) =>
  `mailto:${email}?subject=Everglades Resources Contact Request&body=`
const getCalendarLink = (email) =>
  `mailto:${email}?subject=Everglades Resource Event Request&body=`

// Watch for changes to active filters in the store
watch(
  () => menuStore.active,
  async () => {
    await menuStore.fetchImages()
  },
  { deep: true }
)

// Load additional resources based on the current route
const load = async () => {
  try {
    if (route.fullPath === '/') {
      menuStore.active = {}
      return
    }

    notFound.value = false
    const response = await fetch(`/json/resources${route.path}?page=${page.value}`)
    const data = await response.json()

    resources.value = data.resources
    categories.value = data.categories
    total.value = data.pages

    menuStore.active = {
      boat: data.boat,
      year: data.year,
      type: data.type,
      category: data.category,
    }
  } catch (error) {
    console.error(error)
    notFound.value = true
  }
}

// Watch for route changes and reload resources accordingly
watch(
  () => route.fullPath,
  async () => {
    if (route.query.page) {
      page.value = Number(route.query.page)
    }
    await load()
  },
  { immediate: true }
)

// Fetch initial data when the component mounts
onMounted(() => {
  menuStore.fetchFilters()
  menuStore.fetchImages()
  load()
})
</script>
