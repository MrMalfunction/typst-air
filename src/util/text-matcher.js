// Store imports
import { useEducationInfoStore } from 'src/stores/education-info-store'
import { usePersonalInfoStore } from 'src/stores/personal-info-store'
import { useProjectInfoStore } from 'src/stores/projects-info-store'
import { useSkillsInfoStore } from 'src/stores/skills-info-store'
import { useSummaryStore } from 'src/stores/summary-store'
import { useWorkInfoStore } from 'src/stores/work-info-store'

/**
 * Normalizes text for comparison by removing extra whitespace and converting to lowercase
 * @param {string} text - The text to normalize
 * @returns {string} - The normalized text
 */
const normalizeText = (text) => {
  if (!text || typeof text !== 'string') return ''

  return text
    .trim()
    .toLowerCase()
    .replace(/^[•\-*:]+\s*/, '') // Remove leading bullets, dashes, asterisks, colons
    .replace(/.*?:\s*/, '') // Remove everything before and including the first colon
    .replace(/[•\-*]+/g, '') // Remove remaining bullets, dashes, asterisks
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
}

/**
 * Checks if two text strings match - exact first, then includes
 * @param {string} clickedText - The text from the clicked SVG element
 * @param {string} storeText - The text from the store
 * @param {boolean} exactOnly - If true, only do exact matching
 * @returns {boolean} - True if texts match
 */
const isTextMatch = (clickedText, storeText, exactOnly = false) => {
  if (!clickedText || !storeText) return false

  // Check for empty content after trimming
  const trimmedClicked = clickedText.trim()
  const trimmedStore = storeText.trim()
  if (!trimmedClicked || !trimmedStore) return false

  const normalizedClicked = normalizeText(clickedText)
  const normalizedStore = normalizeText(storeText)

  // Check for empty normalized content
  if (!normalizedClicked || !normalizedStore) return false

  // Exact match
  if (normalizedClicked === normalizedStore) {
    return true
  }

  // If exact only mode, stop here
  if (exactOnly) return false

  // Contains match - only allow clicked text to be contained in store text
  return normalizedStore.includes(normalizedClicked)
}

/**
 * Checks if the clicked text matches any text in the personal info store
 * @param {string} clickedText - The text from the clicked SVG element
 * @returns {boolean} - True if match found
 */
const matchPersonalInfo = (clickedText, exactOnly = false) => {
  const personalStore = usePersonalInfoStore()

  const fieldsToCheck = [
    personalStore.name,
    personalStore.location,
    personalStore.email,
    personalStore.phone,
    personalStore.github,
    personalStore.linkedin,
    personalStore.personalSite,
  ]

  const hasContent = fieldsToCheck.some((field) => field?.trim())
  if (!hasContent) return false

  return fieldsToCheck.some((field) => field?.trim() && isTextMatch(clickedText, field, exactOnly))
}

/**
 * Checks if the clicked text matches any text in the summary store
 * @param {string} clickedText - The text from the clicked SVG element
 * @returns {boolean} - True if match found
 */
const matchSummary = (clickedText, exactOnly = false) => {
  const summaryStore = useSummaryStore()

  if (!summaryStore.summary?.trim()) return false

  return isTextMatch(clickedText, summaryStore.summary, exactOnly)
}

/**
 * Checks if clicked text matches common section headers
 * @param {string} clickedText - The text from the clicked SVG element
 * @returns {string|null} - The section type if header match found
 */
const matchSectionHeaders = (clickedText) => {
  const normalizedText = normalizeText(clickedText)

  const headerMap = {
    education: 'edu',
    'work experience': 'work',
    experience: 'work',
    employment: 'work',
    projects: 'projects',
    skills: 'skills',
    summary: 'summary',
    profile: 'summary',
    about: 'summary',
  }

  for (const [header, section] of Object.entries(headerMap)) {
    if (normalizedText.includes(header) || header.includes(normalizedText)) {
      return section
    }
  }

  return null
}

/**
 * Main function to find which section contains the clicked text
 * First checks for exact matches across all sections, then includes matches
 * @param {string} clickedText - The text from the clicked SVG element
 * @returns {Object|null} - Object with section and entryIndex, or null if no match
 */
export const findSectionForText = (clickedText) => {
  if (!clickedText || typeof clickedText !== 'string') return null

  // Check if it's a section header
  const headerMatch = matchSectionHeaders(clickedText)
  if (headerMatch) {
    return { section: headerMatch, entryIndex: null }
  }

  // Phase 1: Exact matches
  let result = findMatchWithIndex(clickedText, true)
  if (result) return result

  // Phase 2: Includes matches (for line breaks)
  result = findMatchWithIndex(clickedText, false)
  if (result) return result

  return null
}

/**
 * Enhanced text matching that also checks parent elements for context
 * @param {HTMLElement} element - The clicked SVG element
 * @returns {Object|null} - Object with section and entryIndex, or null if no match
 */
export const findSectionForElement = (element) => {
  if (!element) return null

  // Try the element's own text content first
  let textContent = element.textContent?.trim()
  if (textContent) {
    const result = findSectionForText(textContent)
    if (result) return result
  }

  // Try parent elements up to 5 levels for more context
  let currentElement = element.parentElement
  let level = 0
  const maxLevels = 5

  while (currentElement && level < maxLevels) {
    textContent = currentElement.textContent?.trim()
    if (textContent && textContent !== element.textContent?.trim()) {
      const result = findSectionForText(textContent)
      if (result) return result
    }

    currentElement = currentElement.parentElement
    level++
  }

  return null
}

/**
 * Finds matches and returns section with entry index
 * @param {string} clickedText - The text from the clicked SVG element
 * @param {boolean} exactOnly - If true, only do exact matching
 * @returns {Object|null} - Object with section and entryIndex, or null if no match
 */
const findMatchWithIndex = (clickedText, exactOnly) => {
  // Check personal info (no entry index needed)
  if (matchPersonalInfo(clickedText, exactOnly)) {
    return { section: 'personal', entryIndex: null }
  }

  // Check summary (no entry index needed)
  if (matchSummary(clickedText, exactOnly)) {
    return { section: 'summary', entryIndex: null }
  }

  // Check sections with entry indices
  const sections = [
    { name: 'edu', finder: findInEducationWithIndex },
    { name: 'work', finder: findInWorkWithIndex },
    { name: 'projects', finder: findInProjectsWithIndex },
    { name: 'skills', finder: findInSkillsWithIndex },
  ]

  for (const section of sections) {
    const index = section.finder(clickedText, exactOnly)
    if (index !== null) {
      return { section: section.name, entryIndex: index }
    }
  }

  return null
}

// Helper functions for finding matches with index
const findInEducationWithIndex = (clickedText, exactOnly) => {
  const educationStore = useEducationInfoStore()
  if (!educationStore.education?.length) return null

  for (let i = 0; i < educationStore.education.length; i++) {
    const edu = educationStore.education[i]
    const fields = [
      edu.institution,
      edu.location,
      edu.degree,
      edu.startDate,
      edu.endDate,
      ...edu.points,
    ]

    const hasContent = fields.some((field) => field?.trim())
    if (!hasContent) continue

    for (const field of fields) {
      if (field?.trim() && isTextMatch(clickedText, field, exactOnly)) {
        return i
      }
    }
  }
  return null
}

const findInWorkWithIndex = (clickedText, exactOnly) => {
  const workStore = useWorkInfoStore()
  if (!workStore.work?.length) return null

  for (let i = 0; i < workStore.work.length; i++) {
    const work = workStore.work[i]
    const fields = [
      work.title,
      work.company,
      work.location,
      work.startDate,
      work.endDate,
      ...work.points,
    ]

    const hasContent = fields.some((field) => field?.trim())
    if (!hasContent) continue

    for (const field of fields) {
      if (field?.trim() && isTextMatch(clickedText, field, exactOnly)) {
        return i
      }
    }
  }
  return null
}

const findInProjectsWithIndex = (clickedText, exactOnly) => {
  const projectStore = useProjectInfoStore()
  if (!projectStore.projects?.length) return null

  for (let i = 0; i < projectStore.projects.length; i++) {
    const project = projectStore.projects[i]
    const fields = [
      project.name,
      project.role,
      project.url,
      project.startDate,
      project.endDate,
      ...project.points,
    ]

    const hasContent = fields.some((field) => field?.trim())
    if (!hasContent) continue

    for (const field of fields) {
      if (field?.trim() && isTextMatch(clickedText, field, exactOnly)) {
        return i
      }
    }
  }
  return null
}

const findInSkillsWithIndex = (clickedText, exactOnly) => {
  const skillsStore = useSkillsInfoStore()
  if (!skillsStore.skills?.length) return null

  for (let i = 0; i < skillsStore.skills.length; i++) {
    const skill = skillsStore.skills[i]
    const fields = [skill.heading, skill.content]

    const hasContent = fields.some((field) => field?.trim())
    if (!hasContent) continue

    for (const field of fields) {
      if (field?.trim() && isTextMatch(clickedText, field, exactOnly)) {
        return i
      }
    }
  }
  return null
}
