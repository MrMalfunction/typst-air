import { acceptHMRUpdate, defineStore } from 'pinia'
import { formatTypstDate } from 'src/util/format_bullet_points.js'

export const useEducationInfoStore = defineStore('education_info', {
  state: () => ({
    education: [
      {
        id: 1,
        institution: 'Harvey Mudd College',
        location: 'Claremont, CA',
        startDate: 'Aug 2023',
        endDate: 'May 2027',
        degree: "Bachelor's of Science, Computer Science and Mathematics",
        points: [
          'Relevant coursework: Data Structures, Algorithms, Computer Systems',
          'Member of ACM student chapter',
        ],
      },
    ],
  }),
  actions: {
    formatTYPST() {
      return this.education
        .map((edu) => {
          const bulletPoints = edu.points
            .filter((point) => point.trim() !== '')
            .map((point) => `       - ${point}`)
            .join('\n')

          return `
      #edu(
        institution: "${edu.institution}",
        location: "${edu.location}",
        dates: dates-helper(${edu.startDate ? `start-date: "${formatTypstDate(edu.startDate)}"` : ''}${edu.startDate && edu.endDate ? ', ' : ''}${edu.endDate ? `end-date: "${formatTypstDate(edu.endDate)}"` : ''}),
        degree: "${edu.degree}",
      )
      ${bulletPoints}`
        })
        .join('\n')
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useEducationInfoStore, import.meta.hot))
}
