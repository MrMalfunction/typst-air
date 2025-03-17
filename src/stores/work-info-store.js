import { acceptHMRUpdate, defineStore } from 'pinia'
import { formatBulletPoint, formatTypstDate } from 'src/util/format_bullet_points.js'

export const useWorkInfoStore = defineStore('workInfo', {
  state: () => ({
    work: [
      {
        id: 1,
        title: 'Software Engineer',
        company: 'Northeastern University',
        location: 'Boston, MA',
        startDate: 'Jan 2024',
        endDate: 'Present',
        points: [
          'Led SupplyTrace’s backend migration from Django to FastAPI, improving API response times by 19% and cutting server usage by 15%. Optimized PostgreSQL performance by 7% while enhancing documentation and adopting Scrum for better team collaboration.',
          'Designed and implemented ETL pipelines with Prefect/Airflow on university HPC systems using Slurm, increasing data processing reliability by 25%.',
          'Configured cloud infrastructure and CI/CD pipelines, improving operational efficiency by 15%.'
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
