import { acceptHMRUpdate, defineStore } from 'pinia'
import { formatBulletPoint, formatTypstDate } from 'src/util/format_bullet_points.js'

export const useProjectInfoStore = defineStore('project_info', {
  state: () => ({
    projects: [
      {
        id: 1,
        name: 'Hyperschedule',
        role: 'Maintainer',
        startDate: 'Nov 2023',
        endDate: 'Present',
        url: 'hyperschedule.io',
        points: [
          'Maintain open-source scheduler used by 7000+ users at the Claremont Consortium with TypeScript, React and MongoDB',
          'Manage PR reviews, bug fixes, and coordinate with college for releasing scheduling data and over $1500 of yearly funding',
          'Ensure 99.99% uptime during peak loads of 1M daily requests during course registration through redundant servers',
        ],
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
        name: "${project.name}",
        role: "${project.role}"${
          project.startDate
            ? `,
        dates: dates-helper(start-date: "${formatTypstDate(project.startDate)}", end-date: "${formatTypstDate(project.endDate)}")`
            : ''
        }${
          project.url
            ? `,
        url: "${project.url}"`
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
