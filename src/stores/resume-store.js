import { defineStore } from 'pinia'
import { useEducationInfoStore } from 'stores/education-info-store.js'
import { usePersonalInfoStore } from 'stores/personal-info-store.js'
import { useWorkInfoStore } from 'stores/work-info-store.js'
import { useProjectInfoStore } from 'stores/projects-info-store.js'
import { useSkillsInfoStore } from 'stores/skills-info-store.js'
import { deepClone } from 'src/util/deepClone.js'

export const useSaveManagerStore = defineStore('saveManager', {
  state: () => ({
    saves: {},
  }),

  actions: {
    saveState(saveName) {
      const educationStore = useEducationInfoStore()
      const personalStore = usePersonalInfoStore()
      const workStore = useWorkInfoStore()
      const projectStore = useProjectInfoStore()
      const skillsStore = useSkillsInfoStore()

      this.saves[saveName] = {
        educationInfo: deepClone(educationStore.$state),
        personalInfo: deepClone(personalStore.$state),
        workInfo: deepClone(workStore.$state),
        projectInfo: deepClone(projectStore.$state),
        skillsInfo: deepClone(skillsStore.$state),
      }
    },

    restoreState(saveName) {
      if (!this.saves[saveName]) throw new Error(`Unable to find ${saveName}`)

      const educationStore = useEducationInfoStore()
      const personalStore = usePersonalInfoStore()
      const workStore = useWorkInfoStore()
      const projectStore = useProjectInfoStore()
      const skillsStore = useSkillsInfoStore()

      educationStore.$patch(this.saves[saveName].educationInfo)
      personalStore.$patch(this.saves[saveName].personalInfo)
      workStore.$patch(this.saves[saveName].workInfo)
      projectStore.$patch(this.saves[saveName].projectInfo)
      skillsStore.$patch(this.saves[saveName].skillsInfo)
    },

    deleteSave(saveName) {
      delete this.saves[saveName]
    },
  },
  getters: {
    getSaves: (state) => Object.keys(state.saves),
  },

  persist: true,
})
