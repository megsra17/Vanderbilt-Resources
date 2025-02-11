import { defineStore } from 'pinia'
import { useAuthStore } from '@/stores/authStore'
import { reactive } from 'vue' // Import reactive

export const useMenuStore = defineStore('menu', {
  state: () => ({
    user: null,
    menu: reactive({
      years: [],
      boats: [],
      types: [],
    }),
    active: {
      year: null,
      boat: null,
      type: null,
    },
    images: [],
    loading: false,
  }),

  getters: {
    isAuthenticated: () => {
      const authStore = useAuthStore()
      return !!authStore.token
    },
  },

  actions: {
    syncUser() {
      const authStore = useAuthStore()
      this.user = authStore.user
    },
    async fetchFilters() {
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
      this.loading = true

      try {
        // Fetch folders from Cloudinary
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/resources/search?expression=resource_type:image&max_results=500`,
        )
        const data = await response.json()

        // Extract unique folders
        const folders = new Set()
        data.resources.forEach((img) => {
          const folderPath = img.folder || ''
          const parts = folderPath.split('/')
          if (parts.length >= 2) {
            folders.add(parts[1]) // Extract the year
          }
        })

        // Convert folder names to menu items
        this.menu.years = [...folders].map((year) => ({ key: year, year }))
        this.menu.boats = [
          { key: 'boat-1', name: 'Speed Boat' },
          { key: 'boat-2', name: 'Yacht' },
        ] // Placeholder boats
        this.menu.types = [
          { key: 'photos', name: 'Photos' },
          { key: 'videos', name: 'Videos' },
        ]

        // Set active filters to first available
        this.active.year = this.menu.years.length ? this.menu.years[0] : null
        this.active.boat = this.menu.boats.length ? this.menu.boats[0] : null
        this.active.type = this.menu.types.length ? this.menu.types[0] : null
      } catch (error) {
        console.error('Error fetching Cloudinary folders:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchImages() {
      if (!this.active.year || !this.active.type) {
        console.error('Filters are not set correctly')
        return
      }

      const folderPath = `nauticstar/${this.active.year.key}/${this.active.type.key}`
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME

      this.loading = true
      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/resources/search?expression=folder:${folderPath}`,
        )
        const data = await response.json()

        this.images = data.resources.map((img) => ({
          url: img.secure_url,
          alt: img.public_id,
        }))
      } catch (error) {
        console.error('Error fetching Cloudinary images:', error)
        this.images = []
      } finally {
        this.loading = false
      }
    },

    setFilter(filterKey, filterValue) {
      this.active[filterKey] = filterValue
      this.fetchImages() // Fetch new images when a filter is changed
    },
  },
})
