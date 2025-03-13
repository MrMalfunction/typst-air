import { acceptHMRUpdate, defineStore } from 'pinia'

export const useSkillsInfoStore = defineStore('skills_store', {
  state: () => ({
    skills: [
      {
        id: 1,
        heading: 'Programming Languages',
        content: 'JavaScript, Python, C/C++, HTML/CSS, Java, Bash, R, Flutter, Dart',
      },
      {
        id: 2,
        heading: 'Technologies',
        content:
          'React, Astro, Svelte, Tailwind CSS, Git, UNIX, Docker, Caddy, NGINX, Google Cloud Platform',
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
