// Escaping for the two places user text ends up in the generated Typst source.

// Inside a Typst string literal ("..."): only backslash and quote are special.
// Use for every value passed as "..." (names, titles, dates, URLs).
export function escapeTypstString(text) {
  return String(text ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
}

// In Typst markup (bullets, summary, skills): backslash first, then the
// characters that would start code, math, references, labels or content blocks.
export function escapeTypstSpecialChars(text) {
  return String(text ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/([$@#<>[\]])/g, '\\$1')
}

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }

// The rich-text editor stores bullets as HTML, so "&" arrives as "&amp;"
function decodeEntities(text) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, entity) => {
    if (entity[0] === '#') {
      const code =
        entity[1].toLowerCase() === 'x' ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1))
      return Number.isFinite(code) ? String.fromCodePoint(code) : match
    }
    return ENTITIES[entity.toLowerCase()] ?? match
  })
}

// Bullet HTML from the editor -> Typst markup. Text is decoded and escaped;
// <b>/<strong> become *bold*, <a href> becomes #link(...)[...]; other tags are
// dropped (their text is kept).
export function htmlToTypstMarkup(html) {
  return String(html ?? '')
    .split(/(<[^>]*>)/)
    .map((part) => {
      if (!part.startsWith('<')) return escapeTypstSpecialChars(decodeEntities(part))
      if (/^<\/?\s*(b|strong)\b[^>]*>$/i.test(part)) return '*'
      const link = part.match(/^<a\b[^>]*\bhref\s*=\s*"([^"]*)"[^>]*>$/i)
      if (link) return `#link("${escapeTypstString(decodeEntities(link[1]))}")[`
      if (/^<\/\s*a\s*>$/i.test(part)) return ']'
      return ''
    })
    .join('')
}
