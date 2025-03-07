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
            If you require dealer net price sheets, please reach out to your NauticStar regional
            sales manager.
          </p>
        </div>

        <!-- Chesapeake Bay Region & Southeast Contacts -->
        <div class="col-lg-4 col-md-6 mb-4">
          <h5 class="fw-bold">Chesapeake Bay Region</h5>
          <p class="mb-0">
            Ryan Kagy -
            <a :href="getContactLink('ryankagy3@gmail.com')" class="text-decoration-none">
              ryankagy3@gmail.com
            </a>
          </p>
          <p>
            Connor Radcliff -
            <a
              :href="getContactLink('connor.radcliff@nauticstarboats.com')"
              class="text-decoration-none"
            >
              connor.radcliff@nauticstarboats.com
            </a>
          </p>
          <h5 class="fw-bold mt-3">Northeast & Canada Region</h5>
          <p>
            Ryan Kagy -
            <a :href="getContactLink('ryankagy3@gmail.com')" class="text-decoration-none">
              ryankagy3@gmail.com
            </a>
          </p>
          <h5 class="fw-bold mt-3">Southeast and Southwest Region</h5>
          <p class="mb-0">
            Darren Landry -
            <a
              :href="getContactLink('darren.landry@nauticstarboats.com')"
              class="text-decoration-none"
            >
              darren.landry@nauticstarboats.com
            </a>
          </p>
          <p>
            Hunter Landry -
            <a
              :href="getContactLink('darren.landry@nauticstarboats.com')"
              class="text-decoration-none"
            >
              hunter.landry@nauticstarboats.com
            </a>
          </p>
          <h5 class="fw-bold mt-3">Midwest and Florida Region</h5>
          <p class="mb-0">
            Dennis Radcliff -
            <a :href="getContactLink('dennisradcliff@icloud.com')" class="text-decoration-none">
              dennisradcliff@icloud.com
            </a>
          </p>
          <p>
            Connor Radcliffe -
            <a
              :href="getContactLink('connor.radcliff@nauticstarboats.com')"
              class="text-decoration-none"
            >
              connor.radcliff@nauticstarboats.com
            </a>
          </p>
          <h5 class="fw-bold mt-3">West Region</h5>
          <p>
            Brian Allred -
            <a
              :href="getContactLink('dbrian.allred@nauticstarboats.com')"
              class="text-decoration-none"
            >
              brian.allred@nauticstarboats.com
            </a>
          </p>
        </div>

        <!-- Press Contact -->
        <div class="col-lg-4 col-md-12 mb-4">
          <h4 class="fw-bold">Press Contact</h4>
          <p>NauticStar is enthusiastic to provide media and press assets.</p>
          <p>
            <b>Ryan Fritinger</b> - Marketing Manager<br />
            <a href="tel:3308888474" class="text-decoration-none">330.888.8474</a> |
            <a
              :href="getContactLink('ryan.fritinger@nauticstarboats.com')"
              class="text-decoration-none"
            >
              ryan.fritinger@nauticstarboats.com
            </a>
          </p>
        </div>
      </div>
    </div>

    <!-- Upload Section (hidden for user role) -->
    <div v-if="authStore.userRole !== 'user'" class="container py-4">
      <h2 class="boat-title">Upload an Image</h2>
      <div class="mb-3">
        <input type="file" ref="fileInput" @change="handleFileChange" />
      </div>
      <!-- Only show boat dropdown; the year comes from the active store -->
      <div class="row mb-3">
        <div class="col-md-12">
          <select v-model="selectedBoat" class="form-control">
            <option disabled value="">Select Boat Folder</option>
            <option v-for="boat in menuStore.menu.boats" :key="boat.key" :value="boat.key">
              {{ boat.name }}
            </option>
          </select>
        </div>
      </div>
      <button @click="uploadFile" class="btn ever-btn-secondary">Upload</button>
      <div v-if="uploadStatus" class="mt-2">
        {{ uploadStatus }}
      </div>
    </div>

    <!-- Gallery Section for Cloudinary Images -->
    <div class="container py-4">
      <!-- Display the active folder if available -->
      <div v-if="menuStore.active.year && menuStore.active.boat" class="mb-3">
        <h5>
          Currently viewing folder:
          <strong
            >nauticstar/{{ menuStore.active.year.key }}/{{ menuStore.active.boat.key }}</strong
          >
        </h5>
      </div>
      <!-- Use the computed property for the title -->
      <h2 class="boat-title">{{ galleryTitle }}</h2>
      <div v-if="menuStore.loading" class="text-center">Loading images...</div>
      <div v-else class="row">
        <div
          v-for="(img, index) in menuStore.images"
          :key="index"
          class="col-md-3 mb-4 text-center"
        >
          <div class="d-flex flex-column align-items-center">
            <img :src="img.url" :alt="img.alt" class="img-fluid" style="object-fit: cover" />
            <!-- Display the title (use display_name or a title property) -->
            <h5 class="mt-2">{{ (img.display_name || img.alt).split('/').pop() }}</h5>
            <p class="text-muted small">
              Uploaded on: {{ new Date(img.created_at).toLocaleDateString() }}
            </p>
            <a
              :href="img.url.replace('/upload/', '/upload/fl_attachment/')"
              download
              class="btn ever-btn-secondary mt-2"
            >
              Download
            </a>
            <button class="btn ever-btn-primary mt-2" @click="openShareModal(img.url)">
              Share
            </button>
          </div>
        </div>
        <div v-if="menuStore.images.length === 0" class="alert alert-warning text-center">
          No images found.
        </div>
      </div>
    </div>
  </div>
  <!-- Share Modal -->
  <div
    class="modal fade"
    tabindex="-1"
    role="dialog"
    :class="{ show: showShareModal }"
    :style="showShareModal ? 'display: block;' : 'display: none;'"
    aria-modal="true"
  >
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Share Image</h5>
          <button type="button" class="btn-close" @click="closeShareModal"></button>
        </div>
        <div class="modal-body">
          <p>Copy the link below to share this image:</p>
          <div class="input-group">
            <input type="text" class="form-control" v-model="shareUrl" readonly />
            <button class="btn ever-btn-primary" type="button" @click="copyShareUrl">
              Copy Link
            </button>
          </div>
          <div v-if="copySuccess" class="text-success mt-2">Link copied!</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useMenuStore } from '@/stores/useMenuStore'
import { useAuthStore } from '@/stores/authStore'
import { useRouter, useRoute } from 'vue-router'
import backgroundImage from '@/images/main-image.jpg'

// Initialize Stores and Router
const menuStore = useMenuStore()
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

// Reactive state for upload
const fileInput = ref(null)
const selectedFile = ref(null)
const uploadStatus = ref('')
const selectedBoat = ref('')

// New reactive state for the share modal
const showShareModal = ref(false)
const shareUrl = ref('')
const copySuccess = ref(false)

// Compute folder path based on active filter and boat selection
const uploadFolder = computed(() => {
  if (menuStore.active.year && selectedBoat.value) {
    return `nauticstar/${menuStore.active.year.key}/${selectedBoat.value}`
  }
  return 'nauticstar/default'
})

// Local reactive state for additional resources
const resources = ref([])
const categories = ref([])
const page = ref(1)
const total = ref(0)
const notFound = ref(false)

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// Computed property for Gallery title based on active type
const galleryTitle = computed(() => {
  if (menuStore.active.type && menuStore.active.type.name) {
    const typeName = menuStore.active.type.name.toLowerCase()
    if (typeName.includes('video')) {
      return 'Video Gallery'
    } else if (typeName.includes('image')) {
      return 'Image Gallery'
    } else {
      return menuStore.active.type.name + ' Gallery'
    }
  }
  return 'Gallery'
})

// Email helper function for contact links
const getContactLink = (email) =>
  `mailto:${email}?subject=Everglades Resources Contact Request&body=`

// Reactive state for Navbar (declared only once)
const active = ref(null)
const mobileOpen = ref(false)
const userOpen = ref(false)

// Function to reset active filters and close menus
const closeMenu = () => {
  active.value = null
  mobileOpen.value = false
  userOpen.value = false
  menuStore.active = {
    year: menuStore.menu.years.length ? menuStore.menu.years[0] : { key: '', year: 'Unknown' },
    boat: menuStore.menu.boats.length ? menuStore.menu.boats[0] : { key: '', name: 'Unknown' },
    type: menuStore.menu.types.length ? menuStore.menu.types[0] : { key: '', name: 'Unknown' },
  }
}

// Watch for changes in active filters to fetch images
watch(
  () => menuStore.active,
  async () => {
    await menuStore.fetchImages()
  },
  { deep: true },
)

// Load resources based on the current route
const load = async () => {
  try {
    if (route.fullPath === '/') {
      // If authenticated, reset to default filters; else, clear active filters.
      if (authStore.isAuthenticated) {
        closeMenu()
      } else {
        menuStore.active = {}
      }
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

// Watch for route changes and reload resources
watch(
  () => route.fullPath,
  async () => {
    if (route.query.page) {
      page.value = Number(route.query.page)
    }
    await load()
  },
  { immediate: true },
)

// On component mount, fetch filters and images; if authenticated, reset filters.
onMounted(() => {
  menuStore.fetchFilters()
  menuStore.fetchImages()
  load()
  if (authStore.isAuthenticated) {
    closeMenu()
  }
  console.log('Is Authenticated?', authStore.isAuthenticated)
  console.log('Current user:', authStore.getUser)
})

// Watch authentication state; reset filters upon login.
watch(
  () => authStore.isAuthenticated,
  (isAuthenticated) => {
    if (isAuthenticated) {
      closeMenu()
    }
  },
)

// File change handler
function handleFileChange(event) {
  selectedFile.value = event.target.files[0]
}

// Upload file method
async function uploadFile() {
  if (!selectedFile.value) {
    uploadStatus.value = 'Please select a file to upload.'
    return
  }
  if (!selectedBoat.value) {
    uploadStatus.value = 'Please select a boat folder from the dropdown.'
    return
  }
  const formData = new FormData()
  formData.append('file', selectedFile.value)
  formData.append('folder', uploadFolder.value)
  try {
    uploadStatus.value = 'Uploading...'
    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      body: formData,
    })
    const result = await response.json()
    console.log('Upload result:', result)
    uploadStatus.value = 'Upload successful!'
    menuStore.fetchImages()
  } catch (error) {
    console.error('Upload error:', error)
    uploadStatus.value = 'Upload failed.'
  }
}

// Function to open the share modal and set the share URL
const openShareModal = (url) => {
  shareUrl.value = url
  showShareModal.value = true
  copySuccess.value = false
}

// Function to close the share modal
const closeShareModal = () => {
  showShareModal.value = false
}

// Function to copy the share URL to the clipboard
const copyShareUrl = async () => {
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    copySuccess.value = true
  } catch (err) {
    console.error('Failed to copy!', err)
    copySuccess.value = false
  }
}
</script>
