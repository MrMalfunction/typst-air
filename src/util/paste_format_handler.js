export const handleEditorPaste = (e) => {
  // Prevent default browser paste behavior
  e.preventDefault()
  e.stopPropagation()

  // Get plain text from clipboard
  let text = ''
  if (e.clipboardData) {
    text = e.clipboardData.getData('text/plain')
  } else if (window.clipboardData) {
    text = window.clipboardData.getData('text')
  }

  // Strip all HTML tags
  text = text.replace(/<[^>]*>/g, '')

  // Also remove any HTML entities (like &nbsp;, &lt;, etc.)
  text = text.replace(/&[^;]+;/g, ' ')

  // Remove newlines
  text = text.replace(/\n/g, '')

  console.log('Pasted text:', text)

  // Insert clean text at cursor position
  setTimeout(() => {
    document.execCommand('insertText', false, text)
  }, 0)
}
