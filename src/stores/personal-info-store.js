import { acceptHMRUpdate, defineStore } from 'pinia'

export const usePersonalInfoStore = defineStore('personalInfo', {
  state: () => ({
    name: 'Amol Bohora',
    location: 'Boston, MA',
    email: 'bohora.a@northeastern.edu',
    phone: '(555) 555-5555',
    github: 'github.com/MrMalfunction',
    linkedin: 'linkedin.com/in/amol-bohora',
    personalSite: '',
  }),
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePersonalInfoStore, import.meta.hot))
}
