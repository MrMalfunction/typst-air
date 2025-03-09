import { defineStore } from 'pinia'

export const useResumeStore = defineStore('resume', {
  state: () => ({
    savedResumes: {},
    currentResumeName: ''
  }),

  actions: {
    saveResume(name, data) {
      this.savedResumes[name] = data
      this.currentResumeName = name
    },

    loadResume(name) {
      return this.savedResumes[name]
    },

    deleteResume(name) {
      delete this.savedResumes[name]
      if (this.currentResumeName === name) {
        this.currentResumeName = ''
      }
    },

    getAllResumeNames() {
      return Object.keys(this.savedResumes)
    }
  },

  persist: true
})