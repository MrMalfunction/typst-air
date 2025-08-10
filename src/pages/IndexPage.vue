<template>
  <q-layout>
    <HeaderComp />

    <q-page-container>
      <q-page class="row no-wrap">
        <!-- Left side form -->
        <div class="col form-container q-pa-md">
          <!-- Controls Section -->
          <div class="row q-col-gutter-md q-mb-md">
            <SaveComp />
            <StyleOptionsComp />
          </div>

          <!-- Section Reorder -->
          <q-expansion-item
            expand-separator
            icon="reorder"
            label="Reorder Sections"
            class="q-mb-md"
          >
            <SectionReorderComp />
          </q-expansion-item>

          <!-- Personal Information -->
          <div ref="personalInfoSection" class="text-h6">Personal Information</div>
          <div class="row q-col-gutter-md">
            <PersonalInfoComp />

            <!-- Summary Section -->
            <div ref="summarySection" class="col-12">
              <SummaryInfoComp />
            </div>

            <!-- Dynamic Sections -->
            <div
              v-for="section in sectionSeq"
              :key="section"
              :ref="(el) => setSectionRef(section, el)"
              class="section-container"
            >
              <component
                :is="componentMap[section]"
                :ref="(el) => setComponentRef(section, el)"
                :key="`comp-${section}`"
              />
            </div>
          </div>
        </div>

        <!-- Right side preview -->
        <PreviewSVG @scroll-to-section="scrollToSection" />
      </q-page>
    </q-page-container>

    <!-- Footer -->
    <q-footer class="bg-white text-grey-8">
      <q-toolbar class="justify-center">
        <router-link class="text-grey-8 text-decoration-none" to="/acknowledgments">
          Third-Party Acknowledgments
        </router-link>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup>
// Vue imports
import { ref, nextTick } from 'vue'

// Pinia imports
import { storeToRefs } from 'pinia'
import { useSectionSeqStore } from 'stores/section-seq-store'

// Component imports
import HeaderComp from 'components/HeaderComp.vue'
import PersonalInfoComp from 'components/PersonalInfoComp.vue'
import SummaryInfoComp from 'components/SummaryInfoComp.vue'
import EduInfoComp from 'components/EduInfoComp.vue'
import WorkInfoComp from 'components/WorkInfoComp.vue'
import ProjectInfoComp from 'components/ProjectinfoComp.vue'
import SkillsInfoComp from 'components/SkillsInfoComp.vue'
import PreviewSVG from 'components/PreviewSVG.vue'
import SaveComp from 'components/SaveComp.vue'
import StyleOptionsComp from 'components/StyleOptionsComp.vue'
import SectionReorderComp from 'components/SectionReorderComp.vue'

// Store setup
const sectionSeqStore = useSectionSeqStore()
const { sectionSeq } = storeToRefs(sectionSeqStore)

// Component mapping
const componentMap = {
  edu: EduInfoComp,
  work: WorkInfoComp,
  projects: ProjectInfoComp,
  skills: SkillsInfoComp,
}

// Template refs
const personalInfoSection = ref(null)
const summarySection = ref(null)
const sectionRefs = ref({})
const componentRefs = ref({})

// Ref setters
const setSectionRef = (section, el) => {
  if (el) {
    sectionRefs.value[section] = el
  }
}

const setComponentRef = (section, el) => {
  if (el) {
    componentRefs.value[section] = el
  }
}

// Scrolling functionality
const scrollToSection = async (result) => {
  await nextTick()

  let targetElement = null
  const { section: sectionType, entryIndex } = result

  // Try to scroll to specific entry if index provided
  if (entryIndex !== null) {
    try {
      targetElement = findEntryElement(sectionType, entryIndex)
    } catch (error) {
      console.error('Error finding entry element:', error)
    }
  }

  // Fallback to section-level scrolling
  if (!targetElement) {
    switch (sectionType) {
      case 'personal':
        targetElement = personalInfoSection.value
        break
      case 'summary':
        targetElement = summarySection.value
        break
      case 'edu':
      case 'work':
      case 'projects':
      case 'skills':
        targetElement = sectionRefs.value[sectionType]
        break
    }
  }

  if (targetElement?.scrollIntoView) {
    targetElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }
}

const findEntryElement = (sectionType, entryIndex) => {
  const sectionContainer = sectionRefs.value[sectionType]
  if (!sectionContainer) return null

  // Define selector based on section type
  const selectorMap = {
    edu: `[data-education-index="${entryIndex}"]`,
    work: `[data-work-index="${entryIndex}"]`,
    projects: `[data-project-index="${entryIndex}"]`,
    skills: `[data-skill-index="${entryIndex}"]`,
  }

  const selector = selectorMap[sectionType]
  let targetElement = null

  // Try to find element by data attribute
  if (selector && sectionContainer.querySelector) {
    try {
      targetElement = sectionContainer.querySelector(selector)
    } catch (error) {
      console.error('Error using querySelector:', error)
    }
  }

  // Fallback: find by q-card elements
  if (!targetElement && sectionContainer.querySelectorAll) {
    try {
      const entries = sectionContainer.querySelectorAll('.q-card')
      if (entries?.[entryIndex]) {
        targetElement = entries[entryIndex]
      }
    } catch (error) {
      console.error('Error using querySelectorAll:', error)
    }
  }

  return targetElement
}
</script>

<style scoped>
.form-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.section-container {
  width: 100%;
}
</style>
