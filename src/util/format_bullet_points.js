import { escapeTypstString, htmlToTypstMarkup } from 'src/util/typst_conv.js'

// Bullet HTML from the editor -> Typst markup
export const formatBulletPoint = (point) => htmlToTypstMarkup(point)

// Dates are passed to the template as strings
export const formatTypstDate = (dateStr) => {
  return escapeTypstString((dateStr ?? '').trim()) || 'Present'
}
