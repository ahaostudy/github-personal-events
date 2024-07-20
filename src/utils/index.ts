/**
 * Build HTML node from HTML string
 * @param {string} html
 * @returns HTML element
 */
function createElementFromHTML(html: string): Element {
  const container = document.createElement('div')
  container.innerHTML = html
  // @ts-ignore
  return container.firstElementChild
}

/**
 * Extract time information from PR node
 * @param {Element} element
 * @returns DateTime
 */
function getTimeFromEventElement(element: Element): Date | null {
  const relativeTimeElement = element.querySelector('relative-time')
  if (!relativeTimeElement) return null
  return new Date(relativeTimeElement.getAttribute('datetime') || '')
}

export { createElementFromHTML, getTimeFromEventElement }
