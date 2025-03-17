import { acceptHMRUpdate, defineStore } from 'pinia'
import { formatTypstDate } from 'src/util/format_bullet_points.js'

export const useEducationInfoStore = defineStore('educationInfo', {
  state: () => ({
    education: [
      {
        id: 1,
        institution: 'Northeastern University',
        location: 'Boston, MA',
        startDate: 'September 2023',
        endDate: 'December 2025',
        degree: "Bachelor's of Science, Computer Science ",
        points: [
          'Relevant coursework: Program Design Paradigm, Building Scalable Distributed Systems, Algorithms, Cloud Computing, Data Mining Techniques, iOS Development, Human-Computer Interaction.',
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
