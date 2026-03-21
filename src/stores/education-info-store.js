import { acceptHMRUpdate, defineStore } from 'pinia'
import { formatBulletPoint, formatTypstDate } from 'src/util/format_bullet_points.js'
import { escapeTypstSpecialChars } from 'src/util/typst_conv.js'
import { generateId } from 'src/util/id-generator.js'

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
          {
            id: generateId(),
            value:
              'Relevant coursework: Program Design Paradigm, Building Scalable Distributed Systems, Algorithms, Cloud Computing, Data Mining Techniques, iOS Development, Human-Computer Interaction.',
          },
        ],
      },
    ],
  }),
  actions: {
    formatTYPST() {
      return this.education
        .map((edu) => {
          const bulletPoints = edu.points
            .filter(
              (point) => (typeof point === 'string' ? point : point?.value || '').trim() !== '',
            )
            .map(
              (point) =>
                `       - ${formatBulletPoint(typeof point === 'string' ? point : point?.value || '')}`,
            )
            .join('\n')

          return `
      #edu(
        institution: "${escapeTypstSpecialChars(edu.institution)}",
        location: "${escapeTypstSpecialChars(edu.location)}",
        dates: dates-helper(${edu.startDate ? `start-date: "${formatTypstDate(edu.startDate)}"` : ''}${edu.startDate && edu.endDate ? ', ' : ''}${edu.endDate ? `end-date: "${formatTypstDate(edu.endDate)}"` : ''}),
        degree: "${escapeTypstSpecialChars(edu.degree)}",
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
