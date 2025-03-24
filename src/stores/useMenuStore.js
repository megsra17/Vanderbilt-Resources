import { defineStore } from 'pinia'
import { useAuthStore } from '@/stores/authStore'
import { reactive, ref } from 'vue'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

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
        const response = await fetch(`${API_URL}/cloudinary/folders`)
        const data = await response.json()

        // Extract valid years (numbers only)
        this.menu.years = data.years
          .filter((year) => !isNaN(year))
          .map((year) => ({ key: year, year }))

        // Use initial boats and types from API response
        this.menu.boats = data.boats.map((boat) => ({ key: boat, name: boat }))

        // Map types to friendly display names
        const typeDisplayMapping = {
          photos: 'Photos',
          videos: 'Videos',
          brand_logos: 'Brand Guidelines & Logos',
        }
        this.menu.types = data.types.map((type) => ({
          key: type,
          name: typeDisplayMapping[type] || type,
        }))

        // Set default active values (defaulting to first year)
        this.active.year = this.menu.years.length
          ? this.menu.years[0]
          : { key: '2022', year: '2022' }
        this.active.boat = this.menu.boats.length
          ? this.menu.boats[0]
          : { key: 'default', name: 'Default Boat' }
        this.active.type = this.menu.types.length
          ? this.menu.types[0]
          : { key: 'photos', name: 'Photos' }

        this.fetchImages()
      } catch (error) {
        console.error('❌ Error fetching Cloudinary filters:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchBoatsForYear(year) {
      try {
        const response = await fetch(`${API_URL}/cloudinary/list-subfolders?year=${year}`)
        const data = await response.json()

        // Map each subfolder to a boat object
        this.menu.boats = data.subfolders.map((folder) => ({
          key: folder.name,
          name: folder.name,
        }))
        // Update active boat to the first available for the year, if any.
        this.active.boat = this.menu.boats.length
          ? this.menu.boats[0]
          : { key: 'default', name: 'Default Boat' }
      } catch (error) {
        console.error('❌ Error fetching boats for year:', year, error)
      }
    },

    async fetchImages() {
      if (!this.active.year || !this.active.boat) {
        console.error('❌ Filters are not set correctly:', this.active)
        return
      }

      const encodedBoat = encodeURIComponent(this.active.boat.key)

      this.loading = true
      try {
        // Include the "type" filter in the query string
        const response = await fetch(
          `${API_URL}/cloudinary/images?year=${this.active.year.key}&boat=${encodedBoat}&type=${this.active.type.key}`,
        )
        const data = await response.json()

        if (data.images) {
          this.images = data.images.map((img) => ({
            url: img.secure_url,
            alt: img.public_id,
            created_at: img.created_at,
            display_name: img.display_name,
          }))
        } else {
          this.images = []
        }
      } catch (error) {
        console.error('❌ Error fetching Cloudinary images:', error)
        this.images = []
      } finally {
        this.loading = false
      }
    },
    setFilter(filterKey, filterValue) {
      this.active[filterKey] = filterValue
      if (filterKey === 'year') {
        // When the year changes, fetch the boat folders for that year first.
        this.fetchBoatsForYear(filterValue.key).then(() => {
          this.fetchImages()
        })
      } else {
        this.fetchImages()
      }
    },
  },
})
