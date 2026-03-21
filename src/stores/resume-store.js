import { defineStore } from 'pinia'
import { useEducationInfoStore } from 'stores/education-info-store.js'
import { usePersonalInfoStore } from 'stores/personal-info-store.js'
import { useWorkInfoStore } from 'stores/work-info-store.js'
import { useProjectInfoStore } from 'stores/projects-info-store.js'
import { useSkillsInfoStore } from 'stores/skills-info-store.js'
import { useSummaryStore } from 'stores/summary-store.js'
import { generateId } from 'src/util/id-generator.js'

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
      const savedState = secureDeepClone(this.saves[saveName])

      // Helper to migrate points from strings to objects
      const migratePoints = (items) => {
        if (!items) return
        items.forEach((item) => {
          if (
            Array.isArray(item.points) &&
            item.points.length > 0 &&
            typeof item.points[0] === 'string'
          ) {
            item.points = item.points.map((p) => ({ id: generateId(), value: p }))
          }
        })
      }

      if (savedState.educationInfo?.education) migratePoints(savedState.educationInfo.education)
      if (savedState.workInfo?.work) migratePoints(savedState.workInfo.work)
      if (savedState.projectInfo?.projects) migratePoints(savedState.projectInfo.projects)

      educationStore.$patch(savedState.educationInfo)
      personalStore.$patch(savedState.personalInfo)
      workStore.$patch(savedState.workInfo)
      projectStore.$patch(savedState.projectInfo)
      skillsStore.$patch(savedState.skillsInfo)
      summaryStore.$patch(savedState.summaryInfo)
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
