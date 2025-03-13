import { acceptHMRUpdate, defineStore } from 'pinia'

export const usePersonalInfoStore = defineStore('personalInfo', {
  state: () => ({
    name: 'Stephen Xu',
    location: 'San Diego, CA',
    email: 'stxu@hmc.edu',
    phone: '(555) 555-5555',
    github: 'github.com/stuxf',
    linkedin: 'linkedin.com/in/stuxf',
    personalSite: 'stuxf.dev',
  }),
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePersonalInfoStore, import.meta.hot))
}
