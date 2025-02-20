import { defineStore } from 'pinia'
import { useAuthStore } from '@/stores/authStore'
import { reactive, ref } from 'vue'

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
      this.loading = true
      try {
        // Call the backend API to get available folders from Cloudinary
        const response = await fetch('http://localhost:3001/cloudinary/folders')
        const data = await response.json()

        this.menu.years = data.years.map((year) => ({ key: year, year }))
        this.menu.boats = data.boats.map((boat) => ({ key: boat, name: boat }))
        this.menu.types = data.types.map((type) => ({ key: type, name: type }))

        // Set first available filter values
        this.active.year = this.menu.years.length ? this.menu.years[0] : null
        this.active.boat = this.menu.boats.length ? this.menu.boats[0] : null
        this.active.type = this.menu.types.length ? this.menu.types[0] : null
      } catch (error) {
        console.error('Error fetching filters:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchImages() {
      if (!this.active.year || !this.active.type) {
        console.error('Filters are not set correctly')
        return
      }

      this.loading = true
      try {
        // Call the backend API to fetch images
        const response = await fetch(
          `http://localhost:3001/cloudinary/images?year=${this.active.year.key}&type=${this.active.type.key}`,
        )
        const data = await response.json()

        this.images = data.images.map((img) => ({
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
      this.fetchImages()
    },
  },
})
