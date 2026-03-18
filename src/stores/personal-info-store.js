import { acceptHMRUpdate, defineStore } from 'pinia'
import { escapeTypstSpecialChars } from 'src/util/typst_conv.js'

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
  actions: {
    formatTYPST() {
      return `
    #let name = "${escapeTypstSpecialChars(this.name)}"
    #let location = "${escapeTypstSpecialChars(this.location)}"
    #let email = "${this.email}"
    #let phone = "${escapeTypstSpecialChars(this.phone)}"
    #let github = "${escapeTypstSpecialChars(this.github)}"
    #let linkedin = "${escapeTypstSpecialChars(this.linkedin)}"
    #let personal-site = "${escapeTypstSpecialChars(this.personalSite)}"`
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePersonalInfoStore, import.meta.hot))
}
