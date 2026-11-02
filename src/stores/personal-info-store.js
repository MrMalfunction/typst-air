import { acceptHMRUpdate, defineStore } from 'pinia'
import { escapeTypstString } from 'src/util/typst_conv.js'

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
    #let name = "${escapeTypstString(this.name)}"
    #let location = "${escapeTypstString(this.location)}"
    #let email = "${escapeTypstString(this.email)}"
    #let phone = "${escapeTypstString(this.phone)}"
    #let github = "${escapeTypstString(this.github)}"
    #let linkedin = "${escapeTypstString(this.linkedin)}"
    #let personal-site = "${escapeTypstString(this.personalSite)}"`
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePersonalInfoStore, import.meta.hot))
}
