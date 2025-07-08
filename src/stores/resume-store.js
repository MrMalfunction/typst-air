import { defineStore } from 'pinia'
import { useEducationInfoStore } from 'stores/education-info-store.js'
import { usePersonalInfoStore } from 'stores/personal-info-store.js'
import { useWorkInfoStore } from 'stores/work-info-store.js'
import { useProjectInfoStore } from 'stores/projects-info-store.js'
import { useSkillsInfoStore } from 'stores/skills-info-store.js'
import { useSummaryStore } from 'stores/summary-store.js'

// Ensure proper deep cloning for state isolation
function secureDeepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

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
      const summaryStore = useSummaryStore()

      // Use secure deep clone to ensure complete isolation of state
      this.saves[saveName] = {
        educationInfo: secureDeepClone(educationStore.$state),
        personalInfo: secureDeepClone(personalStore.$state),
        workInfo: secureDeepClone(workStore.$state),
        projectInfo: secureDeepClone(projectStore.$state),
        skillsInfo: secureDeepClone(skillsStore.$state),
        summaryInfo: secureDeepClone(summaryStore.$state),
      }
    },

    restoreState(saveName) {
      if (!this.saves[saveName]) throw new Error(`Unable to find ${saveName}`)

      const educationStore = useEducationInfoStore()
      const personalStore = usePersonalInfoStore()
      const workStore = useWorkInfoStore()
      const projectStore = useProjectInfoStore()
      const skillsStore = useSkillsInfoStore()
      const summaryStore = useSummaryStore()

      // Use the $reset API and proper patching to avoid reference issues
      educationStore.$reset()
      personalStore.$reset()
      workStore.$reset()
      projectStore.$reset()
      skillsStore.$reset()
      summaryStore.$reset()

      // Create completely new copies of the saved states
      educationStore.$patch(secureDeepClone(this.saves[saveName].educationInfo))
      personalStore.$patch(secureDeepClone(this.saves[saveName].personalInfo))
      workStore.$patch(secureDeepClone(this.saves[saveName].workInfo))
      projectStore.$patch(secureDeepClone(this.saves[saveName].projectInfo))
      skillsStore.$patch(secureDeepClone(this.saves[saveName].skillsInfo))
      summaryStore.$patch(secureDeepClone(this.saves[saveName].summaryInfo))
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
