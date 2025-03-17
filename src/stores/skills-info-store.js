import { acceptHMRUpdate, defineStore } from 'pinia'

export const useSkillsInfoStore = defineStore('skillsInfo', {
  state: () => ({
    skills: [
      {
        id: 1,
        heading: 'Programming Languages',
        content: 'C, C++, React, Vue, Java, Python, Go, TypeScript, JavaScript, HTML, CSS, SQL.',
      },
      {
        id: 2,
        heading: 'Web/Mobile Development',
        content:
          'React JS, Vue JS, AngularJS, RxJS, FastAPI, iOS, Django, JSON',
      },
      {
        id: 3,
        heading: 'Framework & Tools',
        content:
          'Docker, Git, Jira, Jenkins, JUnit, GitHub Actions, Django ORM, PyTest, SQLAlchemy, PostgreSQL.',
      },
      {
        id: 4,
        heading: 'Cloud Technologies',
        content:
          'AWS (EC2, Lambda, DynamoDB, CloudFront, S3, API Gateway), Cloudflare, Azure, Google Cloud.',
      },
    ],
  }),
  actions: {
    formatTYPST() {
      return this.skills.map((skill) => `- *${skill.heading}*: ${skill.content}`).join('\n')
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSkillsInfoStore, import.meta.hot))
}
