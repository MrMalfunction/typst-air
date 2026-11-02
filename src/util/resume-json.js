// Public resume format: what agents and people read and write (llms.txt,
// resume.schema.json, shared links, JSON import/export). It deliberately uses
// plain names (bullets, website, category/items) and maps them onto the
// stores' internal shape here.

import { useEducationInfoStore } from 'stores/education-info-store.js'
import { usePersonalInfoStore } from 'stores/personal-info-store.js'
import { useWorkInfoStore } from 'stores/work-info-store.js'
import { useProjectInfoStore } from 'stores/projects-info-store.js'
import { useSkillsInfoStore } from 'stores/skills-info-store.js'
import { useSummaryStore } from 'stores/summary-store.js'
import { useSectionSeqStore } from 'stores/section-seq-store.js'
import { useStyleStore } from 'stores/style-store.js'
import { generateId } from 'src/util/id-generator.js'
import { sanitizeBulletHtml } from 'src/util/sanitize-html.js'

export const RESUME_FORMAT_VERSION = 1
export const LINK_PREFIX = '#resume='

// Limits keep a hostile or broken link from freezing the page
const MAX_TEXT = 300
const MAX_LONG_TEXT = 2000
const MAX_ENTRIES = 30
const MAX_BULLETS = 30

const SECTION_KEYS = { education: 'edu', work: 'work', projects: 'projects', skills: 'skills' }
const SECTION_NAMES = Object.fromEntries(Object.entries(SECTION_KEYS).map(([k, v]) => [v, k]))

export class ResumeFormatError extends Error {}

const fail = (message) => {
  throw new ResumeFormatError(message)
}

// Plain text field: string (or number), control characters removed, length capped
const text = (value, field, max = MAX_TEXT) => {
  if (value === undefined || value === null) return ''
  if (typeof value !== 'string' && typeof value !== 'number') fail(`"${field}" must be text`)
  // Control characters (newlines, tabs, NUL, …) become a single space
  const cleaned = String(value)
    .replace(/\p{Cc}+/gu, ' ')
    .trim()
  if (cleaned.length > max) fail(`"${field}" is longer than ${max} characters`)
  return cleaned
}

const list = (value, field, max = MAX_ENTRIES) => {
  if (value === undefined || value === null) return []
  if (!Array.isArray(value)) fail(`"${field}" must be a list`)
  if (value.length > max) fail(`"${field}" has more than ${max} items`)
  return value
}

const object = (value, field) => {
  if (value === undefined || value === null) return {}
  if (typeof value !== 'object' || Array.isArray(value)) fail(`"${field}" must be an object`)
  return value
}

const bullets = (value, field) =>
  list(value, field, MAX_BULLETS)
    .map((b, i) => sanitizeBulletHtml(text(b, `${field}[${i}]`, MAX_LONG_TEXT)))
    .filter(Boolean)
    .map((b) => ({ id: generateId(), value: b }))

/**
 * Validate untrusted input (parsed JSON) and convert it to store state.
 * Missing sections become empty; unknown fields are ignored.
 */
export function parseResume(input) {
  const data = object(input, 'resume')
  if (data.version !== undefined && data.version !== RESUME_FORMAT_VERSION) {
    fail(`Unsupported format version ${data.version} (expected ${RESUME_FORMAT_VERSION})`)
  }

  const personal = object(data.personal, 'personal')
  const id = (() => {
    let n = 1
    return () => n++
  })()

  const sectionOrder = list(data.sectionOrder, 'sectionOrder', 4).map((name) => {
    const key = SECTION_KEYS[name]
    if (!key) fail(`Unknown section "${name}" in sectionOrder`)
    return key
  })
  if (new Set(sectionOrder).size !== sectionOrder.length) fail('sectionOrder repeats a section')
  // Sections not listed keep their default relative order at the end
  for (const key of Object.values(SECTION_KEYS)) {
    if (!sectionOrder.includes(key)) sectionOrder.push(key)
  }

  const style = object(data.style, 'style')
  const number = (value, field, min, max) => {
    if (value === undefined) return undefined
    if (typeof value !== 'number' || Number.isNaN(value) || value < min || value > max) {
      fail(`"${field}" must be a number from ${min} to ${max}`)
    }
    return value
  }

  return {
    personal: {
      name: text(personal.name, 'personal.name'),
      location: text(personal.location, 'personal.location'),
      email: text(personal.email, 'personal.email'),
      phone: text(personal.phone, 'personal.phone'),
      github: text(personal.github, 'personal.github'),
      linkedin: text(personal.linkedin, 'personal.linkedin'),
      personalSite: text(personal.website, 'personal.website'),
    },
    summary: text(data.summary, 'summary', 500),
    education: list(data.education, 'education').map((e, i) => {
      const f = `education[${i}]`
      e = object(e, f)
      return {
        id: id(),
        institution: text(e.institution, `${f}.institution`),
        degree: text(e.degree, `${f}.degree`),
        location: text(e.location, `${f}.location`),
        startDate: text(e.startDate, `${f}.startDate`),
        endDate: text(e.endDate, `${f}.endDate`),
        points: bullets(e.bullets, `${f}.bullets`),
      }
    }),
    work: list(data.work, 'work').map((w, i) => {
      const f = `work[${i}]`
      w = object(w, f)
      return {
        id: id(),
        title: text(w.title, `${f}.title`),
        company: text(w.company, `${f}.company`),
        location: text(w.location, `${f}.location`),
        startDate: text(w.startDate, `${f}.startDate`),
        endDate: text(w.endDate, `${f}.endDate`),
        points: bullets(w.bullets, `${f}.bullets`),
      }
    }),
    projects: list(data.projects, 'projects').map((p, i) => {
      const f = `projects[${i}]`
      p = object(p, f)
      return {
        id: id(),
        name: text(p.name, `${f}.name`),
        role: text(p.role, `${f}.role`),
        url: text(p.url, `${f}.url`),
        startDate: text(p.startDate, `${f}.startDate`),
        endDate: text(p.endDate, `${f}.endDate`),
        points: bullets(p.bullets, `${f}.bullets`),
      }
    }),
    skills: list(data.skills, 'skills').map((s, i) => {
      const f = `skills[${i}]`
      s = object(s, f)
      const items = Array.isArray(s.items)
        ? list(s.items, `${f}.items`, 100)
            .map((item, j) => text(item, `${f}.items[${j}]`))
            .join(', ')
        : text(s.items, `${f}.items`, MAX_LONG_TEXT)
      return { id: id(), heading: text(s.category, `${f}.category`), content: items }
    }),
    sectionOrder,
    style: {
      fontSizePt: number(style.fontSize, 'style.fontSize', 7, 14),
      marginInches: number(style.margin, 'style.margin', 0.1, 1),
      colorCheck: style.coloredHeadings === undefined ? undefined : !!style.coloredHeadings,
    },
  }
}

/** Replace the editor's content with a parsed resume. */
export function applyResume(resume) {
  usePersonalInfoStore().$patch(resume.personal)
  useSummaryStore().summary = resume.summary
  useEducationInfoStore().education = resume.education
  useWorkInfoStore().work = resume.work
  useProjectInfoStore().projects = resume.projects
  useSkillsInfoStore().skills = resume.skills
  useSectionSeqStore().sectionSeq = resume.sectionOrder

  const styleStore = useStyleStore()
  for (const [key, value] of Object.entries(resume.style)) {
    if (value !== undefined) styleStore[key] = value
  }
}

const points = (entry) => entry.points.map((p) => (typeof p === 'string' ? p : p.value))

/** The editor's current content in the public format. */
export function exportResume() {
  const personal = usePersonalInfoStore()
  const style = useStyleStore()
  return {
    version: RESUME_FORMAT_VERSION,
    personal: {
      name: personal.name,
      location: personal.location,
      email: personal.email,
      phone: personal.phone,
      github: personal.github,
      linkedin: personal.linkedin,
      website: personal.personalSite,
    },
    summary: useSummaryStore().summary,
    sectionOrder: useSectionSeqStore().sectionSeq.map((key) => SECTION_NAMES[key]),
    education: useEducationInfoStore().education.map((e) => ({
      institution: e.institution,
      degree: e.degree,
      location: e.location,
      startDate: e.startDate,
      endDate: e.endDate,
      bullets: points(e),
    })),
    work: useWorkInfoStore().work.map((w) => ({
      title: w.title,
      company: w.company,
      location: w.location,
      startDate: w.startDate,
      endDate: w.endDate,
      bullets: points(w),
    })),
    projects: useProjectInfoStore().projects.map((p) => ({
      name: p.name,
      role: p.role,
      url: p.url,
      startDate: p.startDate,
      endDate: p.endDate,
      bullets: points(p),
    })),
    skills: useSkillsInfoStore().skills.map((s) => ({ category: s.heading, items: s.content })),
    style: {
      fontSize: Number(style.fontSizePt),
      margin: Number(style.marginInches),
      coloredHeadings: !!style.colorCheck,
    },
  }
}

/** Parse JSON text from a file or link into store state. */
export function parseResumeJson(jsonText) {
  let data
  try {
    data = JSON.parse(jsonText)
  } catch {
    fail('This is not valid JSON')
  }
  return parseResume(data)
}

/** Shareable link: the resume travels in the URL fragment, which browsers never send to a server. */
export function resumeLink(resume, origin = window.location.origin) {
  return `${origin}/${LINK_PREFIX}${encodeURIComponent(JSON.stringify(resume))}`
}

/** The JSON text carried by a `#resume=` fragment, or null if there isn't one. */
export function resumeJsonFromHash(hash) {
  if (!hash.startsWith(LINK_PREFIX)) return null
  const encoded = hash.slice(LINK_PREFIX.length)
  try {
    return decodeURIComponent(encoded)
  } catch {
    fail('The link is damaged (bad URL encoding)')
  }
}
