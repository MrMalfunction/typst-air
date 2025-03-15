import { acceptHMRUpdate, defineStore } from 'pinia'

export const useJobsStore = defineStore('jobsStore', {
  state: () => ({
    jobs: [
      {
        id: 1,
        title: 'Software Engineer',
        company: 'Tech Company',
        description: 'Some description',
        dateAdded: Date.now(),
      },
    ],
  }),
  actions: {
    addJob(jobData) {
      const newJob = {
        id: Date.now(),
        dateAdded: Date.now(),
        ...jobData,
      }
      this.jobs.push(newJob)
      return newJob
    },
  },
  persist: true,
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useJobsStore, import.meta.hot))
}
