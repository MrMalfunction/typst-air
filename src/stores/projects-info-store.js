import { acceptHMRUpdate, defineStore } from 'pinia'
import { formatBulletPoint, formatTypstDate } from 'src/util/format_bullet_points.js'
import { escapeTypstSpecialChars } from 'src/util/typst_conv.js'

export const useProjectInfoStore = defineStore('projectInfo', {
  state: () => ({
    projects: [
      {
        id: 1,
        name: 'AI Resume Tuner',
        role: 'Creator',
        startDate: 'Jan 2025',
        endDate: 'Present',
        url: 'air.amolbohora.com',
        points: ['Created this website you are interacting with.'],
      },
    ],
  }),
  actions: {
    formatTYPST() {
      return this.projects
        .map((project) => {
          const bulletPoints = project.points
            .filter((point) => point.trim() !== '')
            .map((point) => `       - ${formatBulletPoint(point)}`)
            .join('\n')

          return `
      #project(
        name: "${escapeTypstSpecialChars(project.name)}",
        role: "${escapeTypstSpecialChars(project.role)}"${
          project.startDate
            ? `,
        dates: dates-helper(start-date: "${formatTypstDate(project.startDate)}", end-date: "${formatTypstDate(project.endDate)}")`
            : ''
        }${
          project.url
            ? `,
        url: "${escapeTypstSpecialChars(project.url)}"`
            : ''
        }
      )
      ${bulletPoints}`
        })
        .join('\n')
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProjectInfoStore, import.meta.hot))
}
