<template>
  <!-- The div with ref="app" will serve as our container for the SVG -->
  <div ref="app"></div>
  <!-- Export button to trigger PDF export -->
  <button @click="handleExport">Export to PDF</button>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { $typst } from '@myriaddreamin/typst.ts/dist/esm/contrib/snippet.mjs'
import renderUrl from '@myriaddreamin/typst-ts-renderer/pkg/typst_ts_renderer_bg.wasm?url'
import compileUrl from '@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler_bg.wasm?url'
// Create a reference to the container element
const app = ref(null)

/* Set up Typst’s renderer and compiler options.
   This tells the code how to locate the WASM modules. */
$typst.setRendererInitOptions({
  getModule: () => new URL(renderUrl, import.meta.url),
})
$typst.setCompilerInitOptions({
  getModule: () => new URL(compileUrl, import.meta.url),
})

// Your Typst code variables and content function
const quest = `In Typst, what is the purpose of a #raw("#set", lang: "typ") rule?`
const options = [
  `To set the value of a variable.`,
  `To set default values for optional parameters on an element`,
  `For template usage`,
  `None of these`,
]

const content = () => `
#set text(2em, hyphenate: false)
#set par(justify: true)

#let options(..opts) = {
  set enum(numbering: "(A)")
  for opt in opts.pos() {
    [+ #opt]
  }
}

${quest}

#options${options.map((x) => `[${x}]`).join('')}
`

// Variable that will hold the created SVG element
let svgElement = null

// A function that updates the SVG based on the current window width.
const updateSVG = async () => {
  if (!svgElement) return
  svgElement.innerHTML = await $typst.svg({
    mainContent: content(window.innerWidth),
  })
}

onMounted(async () => {
  if (!app.value) return

  // Create an SVG element using the proper SVG namespace.
  svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg')

  // Render the initial SVG
  svgElement.innerHTML = await $typst.svg({
    mainContent: content(window.innerWidth),
  })

  // Append the SVG to the container element.
  app.value.appendChild(svgElement)

  // Update the SVG on window resize
  window.addEventListener('resize', updateSVG)
})

onBeforeUnmount(() => {
  // Clean up the event listener when the component is unmounted.
  window.removeEventListener('resize', updateSVG)
})

// Export PDF function (ignoring any extra TS type declarations)
const exportPdf = (mainContent) =>
  $typst.pdf({ mainContent }).then((pdfData) => {
    var pdfFile = new Blob([pdfData], { type: 'application/pdf' })

    // Create element with <a> tag to trigger download in a new tab.
    const link = document.createElement('a')
    // Add file content in the object URL
    link.href = URL.createObjectURL(pdfFile)
    // Open in a new tab/window
    link.target = '_blank'
    // Trigger the download
    // Clean up the object URL.
    URL.revokeObjectURL(link.href)
  })

// Function to handle the export button click.
const handleExport = async () => {
  // Use the current window width (or any fixed width) to generate the content.
  const mainContent = content(window.innerWidth)
  await exportPdf(mainContent)
}
</script>

<style scoped>
/* Add any component-specific styles here. */
button {
  margin-top: 20px;
  padding: 10px 20px;
  cursor: pointer;
}
</style>
