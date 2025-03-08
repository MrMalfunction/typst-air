// eslint-disable-next-line no-unused-vars
function convertBoldHtmlToTypstBold(html) {
  // Regular expression to match <b> and <strong> tags
  const boldRegex = /<(b|strong)>(.*?)<\/\1>/gi

  // Replace HTML bold tags with Typst bold syntax
  const typstContent = html.replace(boldRegex, (match, _, text) => {
    return `*${text}*`
  })

  return typstContent
}

// eslint-disable-next-line no-unused-vars
function convertHtmlToTypstLink(html) {
  // Regular expression to match HTML anchor tags
  const anchorRegex = /<a\s+href="([^"]*)">(.*?)<\/a>/gi

  // Replace HTML anchor tags with Typst link syntax
  const typstContent = html.replace(anchorRegex, (match, url, text) => {
    return `#link(${url})[${text}]`
  })

  return typstContent
}

// eslint-disable-next-line no-unused-vars
function esacpeTypstSpecialChars(text) {
  // Regular expression to match Typst special characters
  text = text.replace(/\$/g, '\\$') // Escape dollar sign
  text = text.replace(/@/g, '\\@') // Escape (at) sign

  return text
}
