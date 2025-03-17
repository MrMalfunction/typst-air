<script setup>
import { $typst } from '@myriaddreamin/typst.ts/dist/esm/contrib/snippet.mjs'
import renderUrl from '@myriaddreamin/typst-ts-renderer/pkg/typst_ts_renderer_bg.wasm?url'
import compileUrl from '@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler_bg.wasm?url'
import { onMounted, ref } from 'vue'
import { useEducationInfoStore } from 'stores/education-info-store.js'
import { useWorkInfoStore } from 'stores/work-info-store.js'
import { useProjectInfoStore } from 'stores/projects-info-store.js'
import { useSkillsInfoStore } from 'stores/skills-info-store.js'
import { usePersonalInfoStore } from 'stores/personal-info-store.js'
import { useTypstFormatStore } from 'stores/typst-format-store.js'
import { Notify } from 'quasar'

const personalInfoStore = usePersonalInfoStore()
const educationInfoStore = useEducationInfoStore()
const workInfoStore = useWorkInfoStore()
const projectInfoStore = useProjectInfoStore()
const skillsInfoStore = useSkillsInfoStore()

const typstFormatStore = useTypstFormatStore()

const contentDiv = ref(null)

personalInfoStore.$subscribe(() => {
  console.log('Personal values updated')
  previewSvg()
})

educationInfoStore.$subscribe(() => {
  console.log('Education values updated')
  previewSvg()
})

workInfoStore.$subscribe(() => {
  console.log('Work Experience values updated')
  previewSvg()
})

projectInfoStore.$subscribe(() => {
  console.log('Projects values updated')
  previewSvg()
})

skillsInfoStore.$subscribe(() => {
  console.log('Skills values updated')
  previewSvg()
})

const generateTypstContent = () => {
  console.log('Generating TYPST content')
  console.log()

  const educationSection = educationInfoStore.formatTYPST()

  const workSection = workInfoStore.formatTYPST()

  const projectsSection = projectInfoStore.formatTYPST()

  const skillsSection = skillsInfoStore.formatTYPST()

  return `
    ${typstFormatStore.getTypstFormat}
    #let name = "${personalInfoStore.name}"
    #let location = "${personalInfoStore.location}"
    #let email = "${personalInfoStore.email}"
    #let phone = "${personalInfoStore.phone}"
    #let github = "${personalInfoStore.github}"
    #let linkedin = "${personalInfoStore.linkedin}"
    #let personal-site = "${personalInfoStore.personalSite}"

    #show: resume.with(
      author: name,
      location: location,
      email: email,
      github: github,
      linkedin: linkedin,
      phone: phone,
      personal-site: personal-site,
      accent-color: "#26428b",
      font: "Libertinus Serif",
      paper: "us-letter",
      author-position: center,
      personal-info-position: center,
    )

    == Education
    ${educationSection}

    == Work Experience
    ${workSection}

    == Projects
    ${projectsSection}

    == Skills
    ${skillsSection}
  `
}
const previewSvg = async () => {
  if (!contentDiv.value) return

  try {
    const typstContent = generateTypstContent()
    console.log('Generated Typst content:', typstContent)

    const svg = await $typst.svg({ mainContent: typstContent })
    console.log(`rendered! SvgElement { len: ${svg.length} }`)

    contentDiv.value.innerHTML = svg

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
    Notify.create({
      type: 'negative',
      message: 'Error previewing SVG: ' + error.message,
    })
  }
}

const exportPdf = async () => {
  try {
    // Generate the Typst content
    const typstContent = generateTypstContent()
    // Compile to PDF
    const pdfData = await $typst.pdf({ mainContent: typstContent })
    // Create a blob from the PDF data
    const pdfBlob = new Blob([pdfData], { type: 'application/pdf' })
    // Create a blob URL
    const blobUrl = URL.createObjectURL(pdfBlob)
    // Open PDF in a new tab
    window.open(blobUrl, '_blank')
  } catch (error) {
    console.error('PDF export failed:', error)
    Notify.create({
      type: 'negative',
      message: 'PDF export failed, pls try again',
    })
  }
}

const handleExport = () => exportPdf()

onMounted(async () => {
  $typst.setRendererInitOptions({
    getModule: () => new URL(renderUrl, import.meta.url),
  })
  $typst.setCompilerInitOptions({
    getModule: () => new URL(compileUrl, import.meta.url),
  })

  await previewSvg()

  window.addEventListener('resize', () => previewSvg())
})
</script>

<template>
  <!-- Right side preview -->
  <div class="col preview-container q-pa-md">
    <div class="preview-scroll-container">
      <p class="text-subtitle2 text-grey text-center">
        All of the text below is selectable and copyable.
      </p>
      <div ref="contentDiv" class="svg-container">
        <!-- SVG content will be rendered here -->
        Renderer is loading. Please Wait.
      </div>
    </div>
    <div class="export-button-container">
      <q-btn class="full-width" color="primary" label="Export to PDF" @click="handleExport" />
    </div>
  </div>
</template>

<style scoped>
.preview-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.svg-container {
  flex: 1;
  overflow: auto;
  width: 100%;
}

.skills-input :deep() {
  white-space: pre-wrap;
  word-wrap: break-word;
}

.preview-scroll-container {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 10px;
}

.export-button-container {
  position: sticky;
  bottom: 10px;
  padding-top: 10px;
  background-color: white;
  z-index: 2;
}
</style>
