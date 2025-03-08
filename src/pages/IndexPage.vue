<template>
  <q-layout>
    <q-page-container>
      <q-page class="row no-wrap">
        <!-- Left side editor -->
        <div class="col editor-container q-pa-md">
          <q-editor
            v-model="editorContent"
            :toolbar="editorToolbar"
            :fonts="fonts"
            class="editor-content"
            @update:model-value="handleEditorChange"
          />
        </div>

        <!-- Right side preview -->
        <div class="col preview-container q-pa-md">
          <div ref="contentDiv" class="svg-container"></div>
          <q-btn
            color="primary"
            label="Export to PDF"
            class="q-mt-md full-width"
            @click="handleExport"
          />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { $typst } from '@myriaddreamin/typst.ts/dist/esm/contrib/snippet.mjs'
import renderUrl from '@myriaddreamin/typst-ts-renderer/pkg/typst_ts_renderer_bg.wasm?url'
import compileUrl from '@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler_bg.wasm?url'
import TurndownService from 'turndown'
import { useTypstFormatStore } from 'stores/typst-format-store'

const typstFormatStore = useTypstFormatStore()

// Initialize Turndown
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
})

// Add custom rules for Typst compatibility
turndownService.addRule('typstHeading', {
  filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
  replacement: function (content, node) {
    const level = Number(node.nodeName.charAt(1))
    const heading = '='.repeat(level)
    return `\n${heading} ${content}\n\n`
  },
})

const contentDiv = ref(null)
const editorContent = ref('')

const editorToolbar = [
  ['bold'],
  ['undo', 'redo'],
  // Add more formatting options
]

const fonts = {
  monaco: 'Monaco',
  'courier-new': 'Courier New',
  helvetica: 'Helvetica',
}

// Convert HTML to Typst-compatible markdown
const convertToTypst = (htmlContent) => {
  // Convert HTML to Markdown
  let markdown = turndownService.turndown(htmlContent)
  markdown = markdown.replace(/\*\*/g, '*')
  const resumeTemplate = `
    ${typstFormatStore.getTypstFormat}
    // Put your personal information here, replacing mine
    #let name = "Stephen Xu"
    #let location = "San Diego, CA"
    #let email = "stxu@hmc.edu"
    #let github = "github.com/stuxf"
    #let linkedin = "linkedin.com/in/stuxf"
    #let phone = "+1 (xxx) xxx-xxxx"
    #let personal-site = "stuxf.dev"
    
    #show: resume.with(
      author: name,
      // All the lines below are optional.
      // For example, if you want to to hide your phone number:
      // feel free to comment those lines out and they will not show.
      location: location,
      email: email,
      github: github,
      linkedin: linkedin,
      phone: phone,
      personal-site: personal-site,
      accent-color: "#26428b",
      font: "New Computer Modern",
      paper: "us-letter",
      author-position: center,
      personal-info-position: center,
    )
    
    /*
    * Lines that start with == are formatted into section headings
    * You can use the specific formatting functions if needed
    * The following formatting functions are listed below
    * #edu(dates: "", degree: "", gpa: "", institution: "", location: "")
    * #work(company: "", dates: "", location: "", title: "")
    * #project(dates: "", name: "", role: "", url: "")
    * certificates(name: "", issuer: "", url: "", date: "")
    * #extracurriculars(activity: "", dates: "")
    * There are also the following generic functions that don't apply any formatting
    * #generic-two-by-two(top-left: "", top-right: "", bottom-left: "", bottom-right: "")
    * #generic-one-by-two(left: "", right: "")
    */
    == Education
    
    #edu(
      institution: "Harvey Mudd College",
      location: "Claremont, CA",
      dates: dates-helper(start-date: "Aug 2023", end-date: "May 2027"),
      degree: "Bachelor's of Science, Computer Science and Mathematics",
    )
    - Cumulative GPA: 4.0\\/4.0 | Dean's List, Harvey S. Mudd Merit Scholarship, National Merit Scholarship
    - Relevant Coursework: Data Structures, Program Development, Microprocessors, Abstract Algebra I: Groups and Rings, Linear Algebra, Discrete Mathematics, Multivariable & Single Variable Calculus, Principles and Practice of Comp Sci
    
    == Work Experience
    
    #work(
      title: "Subatomic Shepherd and Caffeine Connoisseur",
      location: "Atomville, CA",
      company: "Microscopic Circus, Schrodinger's University",
      dates: dates-helper(start-date: "May 2024", end-date: "Present"),
    )
    - Played God with tiny molecules, making them dance to uncover the secrets of the universe
    - Convinced high-performance computers to work overtime without unions, reducing simulation time by 50%
    - Wowed a room full of nerds with pretty pictures of invisible things and imaginary findings
    
    #work(
      title: "AI Wrangler and Code Ninja",
      location: "Silicon Mirage, CA",
      company: "Organic Stupidity Startup",
      dates: dates-helper(start-date: "Dec 2023", end-date: "Mar 2024"),
    )
    - Taught robots to predict when (and how much!) humans will empty their wallets at the doctor's office
    - Developed HIPAA-compliant digital signatures, because doctors' handwriting wasn't illegible enough already
    - Turned spaghetti code into a gourmet dish, making other interns drool with envy
    
    #work(
      title: "Digital Playground Architect",
      location: "The Cloud",
      company: "Pixels & Profit Interactive",
      dates: dates-helper(start-date: "Jun 2020", end-date: "May 2023"),
    )
    - Scaled user base from 10 to 2000+, accidentally becoming a small wealthy nation in the process
    - Crafted Bash scripts so clever they occasionally made other engineers weep with joy
    - Automated support responses, reducing human interaction to a level that would make introverts proud
    - Built a documentation site that actually got read, breaking the ancient RTFM curse
    
    #work(
      title: "Code Conjurer Intern",
      location: "Silicon Suburb, CA",
      company: "Bits & Bytes Consulting",
      dates: dates-helper(start-date: "Jun 2022", end-date: "Aug 2022"),
    )
    - Developed a cross-platform mobile app that turned every user into a potential paparazzi
    - Led a security overhaul, heroically saving the company from the menace of "password123"
    
    == Projects
    
    #project(
      name: "Hyperschedule",
      // Role is optional
      role: "Maintainer",
      // Dates is optional
      dates: dates-helper(start-date: "Nov 2023", end-date: "Present"),
      // URL is also optional
      url: "hyperschedule.io",
    )
    - Maintain open-source scheduler used by 7000+ users at the Claremont Consortium with TypeScript, React and MongoDB
      - Manage PR reviews, bug fixes, and coordinate with college for releasing scheduling data and over \\$1500 of yearly funding
    - Ensure 99.99% uptime during peak loads of 1M daily requests during course registration through redundant servers
    
    == Extracurricular Activities
    
    #extracurriculars(
      activity: "Capture The Flag Competitions",
      dates: dates-helper(start-date: "Jan 2021", end-date: "Present"),
    )
    - Founder of Les Amateurs (#link("https://amateurs.team")[amateurs.team]), currently ranked \\#4 US, \\#33 global on CTFTime (2023: \\#4 US, \\#42 global)
    - Organized AmateursCTF 2023 and 2024, with 1000+ teams solving at least one challenge and \\$2000+ in cash prizes
      - Scaled infrastructure using GCP, Digital Ocean with Kubernetes and Docker; deployed custom software on fly.io
    - Qualified for DEFCON CTF 32 and CSAW CTF 2023, two of the most prestigious cybersecurity competitions globally
    
    // #extracurriculars(
    //   activity: "Science Olympiad Volunteering",
    //   dates: "Sep 2023 --- Present"
    // )
    // - Volunteer and write tests for tournaments, including LA Regionals and SoCal State \\@ Caltech
    
    // #certificates(
    //   name: "OSCP",
    //   issuer: "Offensive Security",
    //   // url: "",
    //   date: "Oct 2024",
    // )
    == Skills
    - *Programming Languages*: JavaScript, Python, C/C++, HTML/CSS, Java, Bash, R, Flutter, Dart
    - *Technologies*: React, Astro, Svelte, Tailwind CSS, Git, UNIX, Docker, Caddy, NGINX, Google Cloud Platform

  `

  // Add Typst-specific formatting
  return `
${resumeTemplate}
${markdown}
`
}

// Preview SVG function
const previewSvg = async (htmlContent) => {
  if (!contentDiv.value) return

  try {
    // Convert HTML to Typst format
    const typstContent = convertToTypst(htmlContent)
    console.log('Converted to Typst:', typstContent) // Debug log

    const svg = await $typst.svg({ mainContent: typstContent })
    console.log(`rendered! SvgElement { len: ${svg.length} }`)

    // Set the innerHTML directly like in the original code
    contentDiv.value.innerHTML = svg

    // Get the first SVG element and adjust its dimensions
    const svgElem = contentDiv.value.firstElementChild
    if (svgElem) {
      const width = Number.parseFloat(svgElem.getAttribute('width'))
      const height = Number.parseFloat(svgElem.getAttribute('height'))
      const cw = contentDiv.value.clientWidth - 40
      svgElem.setAttribute('width', cw)
      svgElem.setAttribute('height', (height * cw) / width)
    }
  } catch (error) {
    console.error('Error previewing SVG:', error)
  }
}

// Handle editor changes
const handleEditorChange = (value) => {
  editorContent.value = value
  previewSvg(value)
}

// Export PDF function
const exportPdf = async (htmlContent) => {
  const typstContent = convertToTypst(htmlContent)
  const pdfData = await $typst.pdf({ mainContent: typstContent })
  const pdfFile = new Blob([pdfData], { type: 'application/pdf' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(pdfFile)
  link.target = '_blank'
  link.click()
  URL.revokeObjectURL(link.href)
}

// Handle export button click
const handleExport = () => exportPdf(editorContent.value)

// Initialize Typst on component mount
onMounted(async () => {
  // Initialize Typst
  $typst.setRendererInitOptions({
    getModule: () => new URL(renderUrl, import.meta.url),
  })
  $typst.setCompilerInitOptions({
    getModule: () => new URL(compileUrl, import.meta.url),
  })

  // Set initial content and render
  editorContent.value = '# Hello, Typst!\n\nThis is a test document.'
  await previewSvg(editorContent.value)

  // Add resize handler
  window.addEventListener('resize', () => previewSvg(editorContent.value))
})
</script>

<style scoped>
.editor-container,
.preview-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.editor-content {
  flex: 1;
}

.svg-container {
  flex: 1;
  overflow: auto;
  width: 100%;
}

:deep(.q-editor) {
  display: flex;
  flex-direction: column;
  height: 100%;
}

:deep(.q-editor__content) {
  flex: 1;
  overflow: auto;
}
</style>
