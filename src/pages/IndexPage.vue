<template>
  <q-layout view="hHh lpr fff">
    <q-header>
      <HeaderComp />
    </q-header>

    <q-page-container>
      <q-page class="row no-wrap">
        <!-- Left side form -->
        <div ref="formContainer" class="col form-container" @scroll.passive="updateActiveSection">
          <!-- Controls + section tabs, pinned while scrolling -->
          <div class="form-sticky">
            <div class="row items-center no-wrap form-toolbar">
              <SaveComp />
              <q-space />
              <StyleOptionsComp />
            </div>
            <q-tabs
              :model-value="activeSection"
              active-color="primary"
              align="left"
              class="text-grey-7"
              dense
              indicator-color="primary"
              inline-label
              no-caps
              outside-arrows
            >
              <q-tab
                v-for="tab in navTabs"
                :key="tab.key"
                :label="tab.label"
                :name="tab.key"
                @click="jumpTo(tab.key)"
              />
            </q-tabs>
            <q-separator />
          </div>

          <div class="form-body">
            <!-- Personal Information -->
            <div ref="personalInfoSection" class="text-h6 section-anchor">Personal Information</div>
            <div class="row q-col-gutter-sm">
              <PersonalInfoComp />

              <!-- Summary Section -->
              <div ref="summarySection" class="col-12">
                <SummaryInfoComp />
              </div>

              <!-- Dynamic Sections (order matches the resume) -->
              <TransitionGroup class="col-12" name="section-move" tag="div">
                <div
                  v-for="(section, position) in sectionSeq"
                  :key="section"
                  :ref="(el) => setSectionRef(section, el)"
                  class="section-container section-anchor"
                >
                  <div class="row items-center no-wrap section-heading">
                    <div class="text-h6">{{ sectionTitles[section] }}</div>
                    <q-space />
                    <q-btn
                      :disable="position === 0"
                      color="grey-7"
                      dense
                      flat
                      icon="arrow_upward"
                      round
                      size="sm"
                      @click="moveSection(section, position - 1)"
                    >
                      <q-tooltip>Move {{ sectionTitles[section] }} up on the resume</q-tooltip>
                    </q-btn>
                    <q-btn
                      :disable="position === sectionSeq.length - 1"
                      color="grey-7"
                      dense
                      flat
                      icon="arrow_downward"
                      round
                      size="sm"
                      @click="moveSection(section, position + 1)"
                    >
                      <q-tooltip>Move {{ sectionTitles[section] }} down on the resume</q-tooltip>
                    </q-btn>
                  </div>
                  <component
                    :is="componentMap[section]"
                    :ref="(el) => setComponentRef(section, el)"
                    :key="`comp-${section}`"
                  />
                </div>
              </TransitionGroup>
            </div>
          </div>
        </div>

        <!-- Right side preview -->
        <PreviewSVG @scroll-to-section="scrollToSection" />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
// Vue imports
import { ref, computed, nextTick } from 'vue'

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

const sectionTitles = {
  edu: 'Education',
  work: 'Work Experience',
  projects: 'Projects',
  skills: 'Skills',
}

// Move a section and keep it in view
const moveSection = async (section, newPosition) => {
  sectionSeqStore.moveSection(section, newPosition)
  await nextTick()
  jumpTo(section)
}

// Section tabs (follow the user's section order)
const sectionLabels = {
  edu: 'Education',
  work: 'Experience',
  projects: 'Projects',
  skills: 'Skills',
}
const navTabs = computed(() => [
  { key: 'personal', label: 'Profile' },
  ...sectionSeq.value.map((key) => ({ key, label: sectionLabels[key] })),
])

const formContainer = ref(null)
const activeSection = ref('personal')

const sectionElement = (key) =>
  key === 'personal' ? personalInfoSection.value : sectionRefs.value[key]

// While a tab-triggered smooth scroll runs, keep the clicked tab active
let tabLockUntil = 0

const jumpTo = (key) => {
  activeSection.value = key
  tabLockUntil = Date.now() + 1000
  scrollToSection({ section: key, entryIndex: null })
}

// Highlight the tab of the section currently at the top of the form
const updateActiveSection = () => {
  const container = formContainer.value
  if (!container || Date.now() < tabLockUntil) return

  // At the very bottom, the last section may never reach the top
  if (container.scrollTop + container.clientHeight >= container.scrollHeight - 4) {
    activeSection.value = navTabs.value.at(-1).key
    return
  }

  const threshold = container.getBoundingClientRect().top + 120
  let current = navTabs.value[0].key
  for (const { key } of navTabs.value) {
    const el = sectionElement(key)
    if (el && el.getBoundingClientRect().top <= threshold) current = key
  }
  activeSection.value = current
}

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
  const { section: sectionType, entryIndex } = result

  // Expand the matching entry card so its fields are visible
  if (entryIndex !== null) {
    componentRefs.value[sectionType]?.openEntry?.(entryIndex)
  }

  await nextTick()

  let targetElement = null

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
  height: calc(100vh - 48px);
  overflow-y: auto;
}

.form-sticky {
  position: sticky;
  top: 0;
  z-index: 3;
  background: #fff;
}

body.body--dark .form-sticky {
  background: var(--q-dark-page);
}

.form-toolbar {
  min-width: 0;
  padding: 8px 16px 0;
}

.form-body {
  padding: 8px 16px 24px;
}

/* Keep jump targets clear of the sticky toolbar and tabs */
.section-anchor,
.form-body :deep(.entry-card) {
  scroll-margin-top: 104px;
}

.section-heading {
  margin-top: 8px;
}

.section-move-move {
  transition: transform 0.3s ease;
}

.section-container {
  width: 100%;
}
</style>
