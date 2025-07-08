import { defineStore } from 'pinia'

export const useSectionSeqStore = defineStore('sectionSeqStore', {
  state: () => ({
    sectionSeq: ['edu', 'work', 'projects', 'skills'],
  }),
  actions: {
    moveSection(sectionName, newPosition) {
      const currentIndex = this.sectionSeq.indexOf(sectionName)
      if (currentIndex !== -1 && newPosition >= 0 && newPosition < this.sectionSeq.length) {
        this.sectionSeq.splice(currentIndex, 1)
        this.sectionSeq.splice(newPosition, 0, sectionName)
      }
    },
  },
  persist: true,
})
