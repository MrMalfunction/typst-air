import { acceptHMRUpdate, defineStore } from 'pinia'

export const useJobsStore = defineStore('jobsStore', {
  state: () => ({
    jobs: [
      {
        id: 1,
        title: 'Software Engineer',
        company: 'Tech Company',
        description:
          'About the job\n' +
          'Obsidian Security was founded in 2017 to solve the unaddressed blindspot of SaaS Security. SaaS applications provide the tools employees need to succeed and hold the business’ most critical information. If those tools become unavailable or that data is jeopardized, there is a detrimental impact on the organization.\n' +
          '\n' +
          "Obsidian proudly offers the industry's most comprehensive and powerful SaaS defense solution. We are committed to solving the challenge of SaaS Security for our customers as efficiently and effectively as possible.\n" +
          '\n' +
          'We’re a passionate team optimizing for impact by solving some of the biggest challenges in cybersecurity today. We listen closely to our customers, iterate quickly, and (over) deliver to delight them. Working at Obsidian means contributing to an industry-leading cybersecurity product in an environment where customer satisfaction, privacy, and data ethics are paramount.\n' +
          '\n' +
          'We are looking for a Software Engineer - Generalist to join our growing engineering team. As a generalist, you’ll be working across the entire stack to develop, deploy, and optimize cutting-edge security solutions. You will collaborate closely with product, security, and engineering teams to design, build, and maintain scalable and reliable software. This is an exciting opportunity for someone looking to make a direct impact in a fast-paced, dynamic environment.\n' +
          '\n' +
          'About The Role\n' +
          '\n' +
          'Full-Stack Development: Design, build, and maintain both front-end and back-end components for our SaaS security platform.\n' +
          'Security Focus: Work on security-related features, integrating cutting-edge security protocols, and building tools that help secure our customers’ data and infrastructure.\n' +
          "Collaboration: Work closely with other engineers, product managers, and designers to deliver high-quality features and enhance the platform's security.\n" +
          'System Design: Participate in high-level system design and architecture discussions for new features and products.\n' +
          'Problem Solving: Identify technical issues and implement solutions to improve performance, scalability, and security of the platform.\n' +
          'Continuous Improvement: Drive continuous improvement in code quality, testing, and deployment processes.\n' +
          'Innovation: Stay updated on security trends, technologies, and best practices, and contribute ideas to the development of new security features.\n' +
          '\n' +
          'Key Qualifications\n' +
          '\n' +
          '1-4 years of experience in software development experience.\n' +
          'Experienced in React/ system engineering with a focus on data pipeline optimization.\n' +
          'Solid understanding of distributed systems, databases, and performance tuning.\n' +
          'Thorough understanding of React and its core principles.\n' +
          'Experience with testing frameworks.\n' +
          'Strong analytical skills and a data-driven approach to problem-solving.\n' +
          'Excellent problem-solving skills, creativity, and the ability to work both independently and collaboratively.',
        dateAdded: Date.now(),
      },
    ],
  }),
  actions: {
    addJob(jobData) {
      const newJob = {
        id: Date.now(),
        dateAdded: Date.now(),
        ...jobData,
      }
      this.jobs.push(newJob)
      return newJob
    },
  },
  persist: true,
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useJobsStore, import.meta.hot))
}
