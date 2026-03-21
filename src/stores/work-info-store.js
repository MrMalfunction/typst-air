import { acceptHMRUpdate, defineStore } from 'pinia'
import { formatBulletPoint, formatTypstDate } from 'src/util/format_bullet_points.js'
import { escapeTypstSpecialChars } from 'src/util/typst_conv.js'
import { generateId } from 'src/util/id-generator.js'

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
          {
            id: generateId(),
            value:
              'Led SupplyTrace’s backend migration from Django to FastAPI, improving API response times by 19% and cutting server usage by 15%. Optimized PostgreSQL performance by 7% while enhancing documentation and adopting Scrum for better team collaboration.',
          },
          {
            id: generateId(),
            value:
              'Designed and implemented ETL pipelines with Prefect/Airflow on university HPC systems using Slurm, increasing data processing reliability by 25%.',
          },
          {
            id: generateId(),
            value:
              'Configured cloud infrastructure and CI/CD pipelines, improving operational efficiency by 15%.',
          },
        ],
      },
    ],
  }),
  actions: {
    formatTYPST() {
      return this.work
        .map((work) => {
          const bulletPoints = work.points
            .filter(
              (point) => (typeof point === 'string' ? point : point?.value || '').trim() !== '',
            )
            .map(
              (point) =>
                `       - ${formatBulletPoint(typeof point === 'string' ? point : point?.value || '')}`,
            )
            .join('\n')

          return `
      #work(
        title: "${escapeTypstSpecialChars(work.title)}",
        company: "${escapeTypstSpecialChars(work.company)}",
        location: "${escapeTypstSpecialChars(work.location)}",
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
