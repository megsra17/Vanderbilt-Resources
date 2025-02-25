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
        const response = await fetch('http://localhost:3001/cloudinary/folders')
        const data = await response.json()

        console.log('📁 Fetched Folders:', data)

        // Extract valid years (numbers only)
        this.menu.years = data.years
          .filter((year) => !isNaN(year))
          .map((year) => ({ key: year, year }))

        // Use initial boats and types from API response
        this.menu.boats = data.boats.map((boat) => ({ key: boat, name: boat }))
        this.menu.types = data.types.map((type) => ({ key: type, name: type }))

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

        console.log('✅ Filters set correctly:', this.active)

        this.fetchImages()
      } catch (error) {
        console.error('❌ Error fetching Cloudinary filters:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchBoatsForYear(year) {
      try {
        const response = await fetch(
          `http://localhost:3001/cloudinary/list-subfolders?year=${year}`,
        )
        const data = await response.json()
        console.log(`Fetched boats for year ${year}:`, data.subfolders)
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

      console.log('Active Filters before fetching images:', this.active)

      const encodedBoat = encodeURIComponent(this.active.boat.key)

      console.log(
        `📡 Fetching images for Year: ${this.active.year.key}, Boat: ${this.active.boat.key}, Type: ${this.active.type.key}`,
      )

      this.loading = true
      try {
        // Include the "type" filter in the query string
        const response = await fetch(
          `http://localhost:3001/cloudinary/images?year=${this.active.year.key}&boat=${encodedBoat}&type=${this.active.type.key}`,
        )
        const data = await response.json()

        console.log('📸 API Response in Vue:', data)

        if (data.images) {
          this.images = data.images.map((img) => ({
            url: img.secure_url,
            alt: img.public_id,
          }))
        } else {
          this.images = []
        }

        console.log('🖼️ Processed Images:', this.images)
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
          console.log('Active filters after fetching boats:', this.active)
          this.fetchImages()
        })
      } else {
        this.fetchImages()
      }
    },
  },
})
