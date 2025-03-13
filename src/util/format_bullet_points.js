import {
  convertBoldHtmlToTypstBold,
  convertHtmlToTypstLink,
  escapeTypstSpecialChars,
} from 'src/util/typst_conv.js'

export const formatBulletPoint = (point) => {
  // First escape special Typst characters
  let formatted = escapeTypstSpecialChars(point)
  // Convert HTML bold to Typst bold
  formatted = convertBoldHtmlToTypstBold(formatted)
  // Convert HTML links to Typst links
  formatted = convertHtmlToTypstLink(formatted)
  return formatted
}

export const formatTypstDate = (dateStr) => {
  return dateStr.trim() || 'Present'
}
