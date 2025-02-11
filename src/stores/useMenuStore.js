// import { defineStore } from 'pinia'

// export const useMenuStore = defineStore('menu', {
//   state: () => ({
//     user: JSON.parse(localStorage.getItem('user')) || null, // Load user from local storage
//     active: null,
//     mobileOpen: false,
//     userOpen: false,
//     screenWidth: window.innerWidth,
//     menu: {
//       years: [],
//       boats: [],
//       types: [],
//     },
//   }),
//   getters: {
//     isAuthenticated: (state) => !!state.user,
//     getMenuFilteredByUserRole: (state) => {
//       const menu = JSON.parse(JSON.stringify(state.menu))
//       const allowedResourcesTypeKeys = [
//         'photos',
//         'videos',
//         'brand-guidelines-logos',
//         'specification-sheets',
//         'ramcap',
//         'performance-reports',
//       ]
//       menu.types = menu.types.filter((type) => {
//         if (state.user?.role !== 'press') return true
//         return allowedResourcesTypeKeys.includes(type.key)
//       })
//       return menu
//     },
//   },
//   actions: {
//     setUser(user) {
//       this.user = user
//       localStorage.setItem('user', JSON.stringify(user))
//     },
//     logout() {
//       this.user = null
//       localStorage.removeItem('user')
//     },
//     toggleMobileMenu() {
//       this.mobileOpen = !this.mobileOpen
//     },
//     setActiveMenu(active) {
//       this.active = active
//     },
//     closeUserMenu() {
//       this.userOpen = false
//     },
//     updateScreenWidth() {
//       this.screenWidth = window.innerWidth
//     },
//   },
// })

import { defineStore } from 'pinia'
import { dummyMenuData } from '@/data/dummyMenuData'
import { useAuthStore } from '@/stores/authStore'
import { reactive } from 'vue' // Import reactive

export const useMenuStore = defineStore('menu', {
  state: () => ({
    user: null,
    menu: reactive(dummyMenuData),
    active: {
      year: dummyMenuData.years.length ? dummyMenuData.years[0] : { key: '', year: 'Model Year' },
      boat: dummyMenuData.boats.length ? dummyMenuData.boats[0] : { key: '', name: 'Boat Model' },
      type: dummyMenuData.types.length
        ? dummyMenuData.types[0]
        : { key: '', name: 'Resource Type' },
    },
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
    setFilter(filterKey, filterValue) {
      if (this.active) {
        this.active[filterKey] = filterValue
      }
    },
    resetFilter() {
      Object.assign(this.active, {
        year: { key: '', year: 'Model Year' },
        boat: { key: '', name: 'Boat Model' },
        type: { key: '', name: 'Resource Type' },
      })
    },
  },
})
