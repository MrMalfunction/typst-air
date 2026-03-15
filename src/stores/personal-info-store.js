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
#resume-header(
  name: "${escapeTypstSpecialChars(this.name)}",
  location: "${escapeTypstSpecialChars(this.location)}",
  email: "${escapeTypstSpecialChars(this.email)}",
  phone: "${escapeTypstSpecialChars(this.phone)}",
  github: "${escapeTypstSpecialChars(this.github)}",
  linkedin: "${escapeTypstSpecialChars(this.linkedin)}",
  personal-site: "${escapeTypstSpecialChars(this.personalSite)}",
)`
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePersonalInfoStore, import.meta.hot))
}
