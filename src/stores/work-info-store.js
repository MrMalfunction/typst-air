import { acceptHMRUpdate, defineStore } from 'pinia'
import { formatBulletPoint, formatTypstDate } from 'src/util/format_bullet_points.js'

export const useWorkInfoStore = defineStore('workInfo', {
  state: () => ({
    work: [
      {
        id: 1,
        title: 'Software Engineer',
        company: 'Tech Company',
        location: 'San Francisco, CA',
        startDate: 'Jan 2023',
        endDate: 'Present',
        points: [
          'Led development of core platform features',
          'Managed team of 3 junior developers',
        ],
      },
    ],
  }),
  actions: {
    formatTYPST() {
      return this.work
        .map((work) => {
          const bulletPoints = work.points
            .filter((point) => point.trim() !== '')
            .map((point) => `       - ${formatBulletPoint(point)}`)
            .join('\n')

          return `
      #work(
        title: "${work.title}",
        company: "${work.company}",
        location: "${work.location}",
        dates: dates-helper(start-date: "${formatTypstDate(work.startDate)}", end-date: "${formatTypstDate(work.endDate)}"),
      )
      ${bulletPoints}`
        })
        .join('\n')
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useWorkInfoStore, import.meta.hot))
}
