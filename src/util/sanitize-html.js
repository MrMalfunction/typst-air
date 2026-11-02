// Clean bullet-point HTML that comes from outside the app (shared links,
// imported JSON). Bullets are rendered by a rich-text editor (innerHTML), so
// untrusted markup must never reach it unfiltered.
//
// Only what the resume renderer understands is kept: <b>/<strong> and
// <a href> with an http(s) or mailto URL. Every other element is replaced by
// its text, so nothing executable (scripts, event handlers, images,
// javascript: links) survives.

const SAFE_PROTOCOLS = new Set(['http:', 'https:', 'mailto:'])

const escapeText = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const safeHref = (href) => {
  try {
    const url = new URL(href.trim())
    // new URL() percent-encodes quotes and spaces, so the result is safe to
    // place inside an attribute and inside a Typst string later on
    return SAFE_PROTOCOLS.has(url.protocol) ? url.href : null
  } catch {
    return null
  }
}

const serialize = (node) => {
  if (node.nodeType === Node.TEXT_NODE) return escapeText(node.textContent)
  if (node.nodeType !== Node.ELEMENT_NODE) return ''

  const inner = Array.from(node.childNodes).map(serialize).join('')
  const tag = node.tagName.toLowerCase()

  if (tag === 'b' || tag === 'strong') return inner ? `<b>${inner}</b>` : ''
  if (tag === 'a') {
    const href = safeHref(node.getAttribute('href') || '')
    return href ? `<a href="${href}">${inner}</a>` : inner
  }
  if (tag === 'script' || tag === 'style' || tag === 'template') return ''
  if (tag === 'br') return ' '
  return inner
}

export function sanitizeBulletHtml(html) {
  if (typeof html !== 'string') return ''
  // DOMParser builds an inert document: nothing in it loads or runs
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return Array.from(doc.body.childNodes).map(serialize).join('').replace(/\s+/g, ' ').trim()
}
