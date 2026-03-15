<script setup>
// Vue imports
import { onMounted, ref } from 'vue'

// Quasar imports
import { Notify } from 'quasar'

// Typst imports
import { $typst, preloadRemoteFonts } from '@myriaddreamin/typst.ts'
import renderUrl from '@myriaddreamin/typst-ts-renderer/pkg/typst_ts_renderer_bg.wasm?url'
import compileUrl from '@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler_bg.wasm?url'

// Pinia dark mode store import for seamless toggling
import { useDarkModeStore } from 'src/stores/dark-mode-store.js'
import { storeToRefs } from 'pinia'

// Store imports
import { useEducationInfoStore } from 'stores/education-info-store.js'
import { usePersonalInfoStore } from 'stores/personal-info-store.js'
import { useProjectInfoStore } from 'stores/projects-info-store.js'
import { useSectionSeqStore } from 'stores/section-seq-store'
import { useSkillsInfoStore } from 'stores/skills-info-store.js'
import { useStyleStore } from 'stores/style-store.js'
import { useSummaryStore } from 'src/stores/summary-store'
import { useTypstFormatStore } from 'stores/typst-format-store.js'
import { useWorkInfoStore } from 'stores/work-info-store.js'

// Utility imports
import { findSectionForElement } from 'src/util/text-matcher.js'

const emit = defineEmits(['scroll-to-section'])

// Store instances
const educationInfoStore = useEducationInfoStore()
const personalInfoStore = usePersonalInfoStore()
const projectInfoStore = useProjectInfoStore()
const sectionSeqStore = useSectionSeqStore()
const skillsInfoStore = useSkillsInfoStore()
const styleStore = useStyleStore()
const summaryStore = useSummaryStore()
const typstFormatStore = useTypstFormatStore()
const workInfoStore = useWorkInfoStore()
const darkModeStore = useDarkModeStore()
const { isDark } = storeToRefs(darkModeStore)

// Rerender SVG when dark mode changes
import { watch } from 'vue'
watch(isDark, () => {
  debouncePreviewSvg()
})

// Component refs
const contentDiv = ref(null)

// Debouncing for preview updates
let previewTimeout = null
const debouncePreviewSvg = () => {
  if (previewTimeout) clearTimeout(previewTimeout)
  previewTimeout = setTimeout(() => {
    previewSvg()
  }, 50)
}

// Store subscriptions for automatic preview updates
personalInfoStore.$subscribe(() => debouncePreviewSvg())
educationInfoStore.$subscribe(() => debouncePreviewSvg())
workInfoStore.$subscribe(() => debouncePreviewSvg())
projectInfoStore.$subscribe(() => debouncePreviewSvg())
skillsInfoStore.$subscribe(() => debouncePreviewSvg())
styleStore.$subscribe(() => debouncePreviewSvg())
summaryStore.$subscribe(() => debouncePreviewSvg())
sectionSeqStore.$subscribe(() => debouncePreviewSvg())

const generateTypstContent = () => {
  // Generate sections content
  const educationSection = educationInfoStore.formatTYPST()
  const workSection = workInfoStore.formatTYPST()
  const projectsSection = projectInfoStore.formatTYPST()
  const skillsSection = skillsInfoStore.formatTYPST()

  // Style configuration
  const fontSize = styleStore.fontSizePt
  const marginInches = styleStore.marginInches

  // Use Pinia store for dark mode
  const dark = isDark.value

  // colorCheck logic: blue in light mode, white in dark mode if enabled, else black/white
  let headingColor
  if (styleStore.colorCheck) {
    headingColor = dark ? '#fff' : '#26428b'
  } else {
    headingColor = dark ? '#fff' : '#000'
  }
  // Set text color for SVG based on dark mode
  const svgTextColor = dark ? '#fff' : '#000'

  // Section mapping
  const sectionMap = {
    edu: `== Education\n${educationSection}`,
    work: `== Work Experience\n${workSection}`,
    projects: `== Projects\n${projectsSection}`,
    skills: `== Skills\n${skillsSection}`,
  }

  // Build ordered sections
  let orderedSections = ''
  sectionSeqStore.sectionSeq.forEach((sectionName) => {
    orderedSections += sectionMap[sectionName] + '\n\n'
  })

  return `
    #set text(size: ${fontSize}pt, fill: rgb("${svgTextColor}"))
    ${typstFormatStore.getTypstFormat}
    #let name = "${personalInfoStore.name}"
    #let location = "${personalInfoStore.location}"
    #let email = "${personalInfoStore.email}"
    #let phone = "${personalInfoStore.phone}"
    #let github = "${personalInfoStore.github}"
    #let linkedin = "${personalInfoStore.linkedin}"
    #let personal-site = "${personalInfoStore.personalSite}"
    #set text(
      font: "Times New Roman" // Useless as loaded font is used.
    )

    #show: resume.with(
      author: name,
      location: location,
      email: email,
      github: github,
      linkedin: linkedin,
      phone: phone,
      personal-site: personal-site,
      accent-color: "#26428b",
      heading-color: "${headingColor}",
      paper: "us-letter",
      author-position: center,
      personal-info-position: center,
      margin: ${marginInches}in,
    )

    ${summaryStore.summary ? `== Summary\n${summaryStore.formatTYPST()}` : ''}

    ${orderedSections}
  `
}
const previewSvg = async () => {
  if (!contentDiv.value) return

  try {
    const typstContent = generateTypstContent()
    const svg = await $typst.svg({ mainContent: typstContent })
    contentDiv.value.innerHTML = svg

    const svgElem = contentDiv.value.firstElementChild
    if (svgElem) {
      setupSvgScaling(svgElem)
      setupInteractivity(svgElem)
    }
  } catch (error) {
    console.error('Error previewing SVG:', error)
    Notify.create({
      type: 'negative',
      message: 'Error previewing SVG: ' + error.message,
    })
  }
}

const setupSvgScaling = (svgElem) => {
  const width = Number.parseFloat(svgElem.getAttribute('width'))
  const height = Number.parseFloat(svgElem.getAttribute('height'))
  const cw = contentDiv.value.clientWidth - 40
  svgElem.setAttribute('width', cw)
  svgElem.setAttribute('height', (height * cw) / width)
}

const setupInteractivity = (svgElem) => {
  // Hover effects
  svgElem.addEventListener('mouseover', handleMouseOver)
  svgElem.addEventListener('mouseout', handleMouseOut)
  svgElem.addEventListener('click', handleClick)
}

/**
 * Handles mouse over for SVG .tsel elements (adds glow/fill).
 */
const handleMouseOver = (event) => {
  const hoveredElement = event.target
  if (hoveredElement.classList?.contains('tsel')) {
    hoveredElement.style.cursor = 'pointer'
    hoveredElement.setAttribute('filter', 'url(#svg-hover-glow)')
    // Use Pinia store for dark mode for hover
    hoveredElement.setAttribute('fill', isDark.value ? '#4fc3f7' : '#26428b')
  }
}

/**
 * Handles mouse out for SVG .tsel elements (removes glow/fill).
 */
const handleMouseOut = (event) => {
  const hoveredElement = event.target
  if (hoveredElement.classList?.contains('tsel')) {
    hoveredElement.style.cursor = 'default'
    hoveredElement.removeAttribute('filter')
    // Use Pinia store for dark mode for hover out
    hoveredElement.setAttribute('fill', isDark.value ? '#fff' : '#000')
  }
}

const handleClick = (event) => {
  const clickedElement = event.target
  if (!clickedElement.classList?.contains('tsel')) return

  const result = findSectionForElement(clickedElement)
  if (result) {
    emit('scroll-to-section', result)
    showNavigationFeedback(result)
  } else {
    console.log('No matching section found for clicked text')
    Notify.create({
      type: 'info',
      message: 'No editable section found for this content',
      timeout: 1500,
      position: 'top',
    })
  }
}

const showNavigationFeedback = (result) => {
  const sectionNames = {
    personal: 'Personal Information',
    summary: 'Summary',
    edu: 'Education',
    work: 'Work Experience',
    projects: 'Projects',
    skills: 'Skills',
  }

  let message = `Navigating to ${sectionNames[result.section] || result.section}`
  if (result.entryIndex !== null) {
    message += ` entry #${result.entryIndex + 1}`
  }
  message += ' section'

  Notify.create({
    type: 'positive',
    message: message,
    timeout: 1500,
    position: 'top',
  })
}

const exportPdf = async () => {
  try {
    // Always use light mode colors for PDF export
    const fontSize = styleStore.fontSizePt
    const marginInches = styleStore.marginInches
    let headingColor
    if (styleStore.colorCheck) {
      headingColor = '#26428b'
    } else {
      headingColor = '#000'
    }
    const svgTextColor = '#000'

    const educationSection = educationInfoStore.formatTYPST()
    const workSection = workInfoStore.formatTYPST()
    const projectsSection = projectInfoStore.formatTYPST()
    const skillsSection = skillsInfoStore.formatTYPST()

    const sectionMap = {
      edu: `== Education\n${educationSection}`,
      work: `== Work Experience\n${workSection}`,
      projects: `== Projects\n${projectsSection}`,
      skills: `== Skills\n${skillsSection}`,
    }

    let orderedSections = ''
    sectionSeqStore.sectionSeq.forEach((sectionName) => {
      orderedSections += sectionMap[sectionName] + '\n\n'
    })

    const typstContent = `
      #set text(size: ${fontSize}pt, fill: rgb("${svgTextColor}"))
      ${typstFormatStore.getTypstFormat}
      ${personalInfoStore.formatTYPST()}
      #set text(
        font: "Times New Roman" // Useless as loaded font is used.
      )

      #show: resume.with(
        author: name,
        location: location,
        email: email,
        github: github,
        linkedin: linkedin,
        phone: phone,
        personal-site: personal-site,
        accent-color: "#26428b",
        heading-color: "${headingColor}",
        paper: "us-letter",
        author-position: center,
        personal-info-position: center,
        margin: ${marginInches}in,
      )

      ${summaryStore.summary ? `== Summary\n${summaryStore.formatTYPST()}` : ''}

      ${orderedSections}
    `

    const pdfData = await $typst.pdf({ mainContent: typstContent })
    const pdfBlob = new Blob([pdfData], { type: 'application/pdf' })

    // Generate filename
    let fileName = personalInfoStore.name.trim() || 'Resume'
    fileName = fileName.replace(/[^\w\s-]/g, '').replace(/\s+/g, ' ') + ' Resume.pdf'

    // Create and trigger download
    const downloadLink = document.createElement('a')
    downloadLink.href = URL.createObjectURL(pdfBlob)
    downloadLink.download = fileName

    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)

    URL.revokeObjectURL(downloadLink.href)
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
  // Initialize Typst renderer and compiler
  const fontPreload = preloadRemoteFonts(['fonts/times.ttf', 'fonts/times-bold.ttf'])

  $typst.setRendererInitOptions({
    getModule: () => new URL(renderUrl, import.meta.url),
    beforeBuild: [fontPreload],
  })

  $typst.setCompilerInitOptions({
    getModule: () => new URL(compileUrl, import.meta.url),
    beforeBuild: [fontPreload],
  })

  await previewSvg()
  window.addEventListener('resize', () => previewSvg())
})
</script>

<template>
  <!-- Right side preview -->
  <div class="col preview-container q-pa-md">
    <p class="text-subtitle2 text-grey text-center">
      All of the text below is selectable and copyable.
    </p>
    <div class="preview-scroll-container">
      <div ref="contentDiv" class="svg-container">
        <!-- SVG filter for hover glow effect -->
        <svg width="0" height="0" style="position: absolute">
          <filter id="svg-hover-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="#4fc3f7" flood-opacity="1" />
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="6"
              flood-color="#4fc3f7"
              flood-opacity="0.7"
            />
          </filter>
        </svg>
        <!-- SVG content will be rendered here -->
        Renderer is loading. Please Wait.
      </div>
    </div>
    <div class="export-button-container">
      <q-btn
        class="full-width"
        color="primary"
        :label="isDark ? 'Export PDF (White Mode)' : 'Export to PDF'"
        @click="handleExport"
      />
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
  border: #1d1d1d solid 1px;
}

/* SVG hover effect for .tsel (text selection) */
.svg-container :deep(.tsel) {
  transition:
    fill 0.18s,
    filter 0.18s;
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
