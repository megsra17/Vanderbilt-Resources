<style>
.pagination-container {
  gap: 0.5rem;
}

.page-arrow,
.page-number {
  background: transparent;
  border: 1px solid #ccc;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: 0 0.25rem;
}

.page-arrow:disabled,
.page-number:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-number.active {
  background-color: black; /* your brand color */
  color: #fff;
  border-color: black;
}

.custom-border {
  border-right: 1px solid black;
}

@media (max-width: 991px) {
  .custom-border {
    border-right: none;
  }
}
</style>

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
          <h4 class="fw-bold text-decoration-underline">Sales & Servicing</h4>
          <p>
            If you require dealer net price sheets, please reach out to your Vanderbilt regional
            sales manager.
          </p>
        </div>

        <!-- Chesapeake Bay Region & Southeast Contacts -->
        <div class="col-lg-4 col-md-6 mb-4 custom-border">
          <h5 class="fw-bold mt-3 mb-0">Sales</h5>
          <p class="mb-0">
            Dennis Radcliff -
            <a :href="getContactLink('dennisradcliff@icloud.com')" class="text-decoration-none">
              dennisradcliff@icloud.com
            </a>
          </p>
          <p class="mb-0">
            Connor Radcliff -
            <a :href="getContactLink('connorradcliff@gmail.com')" class="text-decoration-none">
              connorradcliff@gmail.com
            </a>
          </p>
          <p class="mb-0">
            Darren Landry -
            <a :href="getContactLink('darren@dplrocks.com')" class="text-decoration-none">
              darren@dplrocks.com
            </a>
          </p>
          <p class="mb-0">
            Chase Oldsen -
            <a
              :href="getContactLink('coldsen@vanderbiltpontoons.com')"
              class="text-decoration-none"
            >
              coldsen@vanderbiltpontoons.com
            </a>
          </p>
        </div>

        <!-- Press Contact -->
        <div class="col-lg-4 col-md-12 mb-4 ps-lg-5">
          <h4 class="fw-bold text-decoration-underline">Press Contact</h4>
          <p>Vanderbilt is enthusiastic to provide media and press assets.</p>
          <p>
            <b>Tricia Niebuhr</b> - General Manager<br />
            <a href="tel:2604787227" class="text-decoration-none">260.478.7227</a> |
            <a
              :href="getContactLink('TNiebuhr@vanderbiltpontoons.com')"
              class="text-decoration-none"
            >
              TNiebuhr@vanderbiltpontoons.com
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
      <nav style="--bs-breadcrumb-divider: '/'" aria-label="breadcrumb" class="mb-2">
        <ol class="breadcrumb">
          <!-- Home -->
          <li class="breadcrumb-item">
            <router-link to="/">Home</router-link>
          </li>

          <!-- Year (non-active) -->
          <li class="breadcrumb-item">
            <router-link>
              {{ menuStore.active.year?.key || '2025' }}
            </router-link>
          </li>

          <!-- Boat Model (active) -->
          <li class="breadcrumb-item active" aria-current="page">
            {{ menuStore.active.boat?.key || 'Model' }}
          </li>
        </ol>
      </nav>
      <!-- Use the computed property for the title -->
      <h2 class="boat-title">{{ galleryTitle }}</h2>
      <div v-if="menuStore.loading" class="text-center">Loading images...</div>
      <div v-else>
        <!-- Image Cards -->
        <div class="row">
          <div
            v-for="(img, index) in paginatedImages"
            :key="index"
            class="col-md-3 mb-4 text-center"
          >
            <div class="card h-100 d-flex flex-column justify-content-between">
              <!-- Card image with play button overlay for videos -->
              <div class="position-relative">
                <img
                  :src="getPreviewUrl(img.url)"
                  :alt="img.alt"
                  class="card-img-top"
                  style="object-fit: cover; max-height: 200px"
                />
                <!-- Show the play button overlay if the asset is a video -->
                <template v-if="img.url.toLowerCase().endsWith('.mp4')">
                  <button
                    class="play-button"
                    @click="openVideo(img.url)"
                  >
                    ▶
                  </button>
                </template>
              </div>

              <!-- Card body -->
              <div class="card-body">
                <p class="card-title fw-bold fs-14">
                  {{ (img.display_name || img.alt).split('/').pop() }}
                </p>
                <p class="text-muted small mb-2">
                  Uploaded on: {{ new Date(img.created_at).toLocaleDateString() }}
                </p>
                <p class="card-text d-flex align-items-center justify-content-center">
                  Download:
                  <template v-if="img.url.toLowerCase().endsWith('.mp4')">
                    <a
                      :href="getDownloadLink(img.url)"
                      download
                      class="ever-text-primary text-hover-primary ms-1"
                    >
                      Video
                    </a>
                  </template>
                  <template v-else>
                    <a
                      :href="getDownloadLink(img.url)"
                      download
                      class="ever-text-primary text-hover-primary ms-1"
                    >
                      High Res
                    </a>
                    <a
                      :href="getDownloadLink(img.url, true)"
                      download
                      class="ever-text-primary text-hover-primary ms-2"
                    >
                      Low Res
                    </a>
                  </template>
                </p>
            </div>
              <!-- Card footer (optional) -->
              <div class="card-footer bg-transparent border-0">
                <button class="btn ever-btn-boarder w-100" @click="openShareModal(img.url)">
                  Share
                </button>
              </div>
            </div>
          </div>
          <div v-if="menuStore.images.length === 0" class="alert alert-warning text-center">
            No images found.
          </div>
        </div>

        <!-- Pagination Controls -->
        <div class="d-flex justify-content-center align-items-center mt-4 pagination-container">
          <!-- Go to first page -->
          <button class="page-arrow" :disabled="currentPage === 1" @click="goToPage(1)">«</button>

          <!-- Go to previous page -->
          <button
            class="page-arrow"
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
          >
            ‹
          </button>

          <!-- Page numbers -->
          <button
            v-for="pageNumber in pages"
            :key="pageNumber"
            class="page-number"
            :class="{ active: pageNumber === currentPage }"
            @click="goToPage(pageNumber)"
          >
            {{ pageNumber }}
          </button>

          <!-- Go to next page -->
          <button
            class="page-arrow"
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
          >
            ›
          </button>

          <!-- Go to last page -->
          <button
            class="page-arrow"
            :disabled="currentPage === totalPages"
            @click="goToPage(totalPages)"
          >
            »
          </button>
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
import backgroundImage from '@/images/VLP-main-image.jpg'

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

// State for share modal
const showShareModal = ref(false)
const shareUrl = ref('')
const copySuccess = ref(false)

// Pagination state
const currentPage = ref(1)
const imagesPerPage = 32

// totalPages: how many pages based on images length
const totalPages = computed(() => Math.ceil(menuStore.images.length / imagesPerPage))

// pages: array of page numbers
const pages = computed(() => {
  return Array.from({ length: totalPages.value }, (_, i) => i + 1)
})

// paginatedImages: slice of images for the current page
const paginatedImages = computed(() => {
  const startIndex = (currentPage.value - 1) * imagesPerPage
  const endIndex = currentPage.value * imagesPerPage
  return menuStore.images.slice(startIndex, endIndex)
})

// Go to specific page
function goToPage(pageNumber) {
  if (pageNumber < 1) pageNumber = 1
  if (pageNumber > totalPages.value) pageNumber = totalPages.value
  currentPage.value = pageNumber
}

// Cloudinary folder path
const uploadFolder = computed(() => {
  if (menuStore.active.year && selectedBoat.value) {
    return `vanderbilt/${menuStore.active.year.key}/${selectedBoat.value}`
  }
  return 'vanderbilt/default'
})

// Local reactive state for resources
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
    } else if (typeName.includes('photos')) {
      return 'Image Gallery'
    } else {
      return menuStore.active.type.name + ' Gallery'
    }
  }
  return 'Gallery'
})

// Email helper function
const getContactLink = (email) =>
  `mailto:${email}?subject=Vanderbilt Resources Contact Request&body=`

// Navbar states
const active = ref(null)
const mobileOpen = ref(false)
const userOpen = ref(false)

// Close menu
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
    // Reset to page 1 when the filter changes
    currentPage.value = 1
  },
  { deep: true },
)

// Load resources based on the current route
const load = async () => {
  try {
    if (route.fullPath === '/') {
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

// Watch route changes
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

// On mount
onMounted(() => {
  menuStore.fetchFilters()
  menuStore.fetchImages()
  load()
  if (authStore.isAuthenticated) {
    closeMenu()
  }
})

// Watch auth state
watch(
  () => authStore.isAuthenticated,
  (isAuthenticated) => {
    if (isAuthenticated) {
      closeMenu()
    }
  },
)

function openVideo(url) {
  window.open(url, '_blank');
}

function getDownloadLink(url, isLowRes = false) {
  const isVideo = url.toLowerCase().endsWith('.mp4');
  if (isVideo) {
    return url.replace('/upload/', '/upload/fl_attachment/') + '?dl=1';
  } else {
    // For images, if low-res is requested, apply the transformation.
    if (isLowRes) {
      return url.replace(
        '/upload/',
        '/upload/q_auto:eco,w_1920,h_1280,c_fit/fl_attachment/'
      ) + '?dl=1';
    } else {
      return url.replace('/upload/', '/upload/fl_attachment/') + '?dl=1';
    }
  }
}

function getPreviewUrl(url) {
  const lowerUrl = url.toLowerCase()
  if (lowerUrl.endsWith('.pdf')) {
    const parts = url.split('/upload/')
    let base = parts[0]
    if (base.includes('/raw/')) {
      base = base.replace('/raw/', '/image/')
    }
    return `${base}/upload/pg_1,f_jpg/${parts[1].replace(/\.pdf$/i, '.jpg')}`
  }
  // If it's an EPS, just force conversion to JPG.
  else if (lowerUrl.endsWith('.eps')) {
    const parts = url.split('/upload/')
    let base = parts[0]
    if (base.includes('/raw/')) {
      base = base.replace('/raw/', '/image/')
    }
    return `${base}/upload/f_jpg/${parts[1].replace(/\.eps$/i, '.jpg')}`
  }
  //if its an mp4, just force conversion to JPG
  else if (lowerUrl.endsWith('.mp4')) {
    const parts = url.split('/upload/')
    let base = parts[0]
    if (base.includes('/raw/')) {
      base = base.replace('/raw/', '/image/')
    }
    return `${base}/upload/f_jpg/${parts[1].replace(/\.mp4$/i, '.jpg')}`
  }
  // For other files, return the original URL.
  return url
}

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

// Share modal methods
const openShareModal = (url) => {
  shareUrl.value = url
  showShareModal.value = true
  copySuccess.value = false
}
const closeShareModal = () => {
  showShareModal.value = false
}
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
