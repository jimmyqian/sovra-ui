/**
 * HTML sanitization utilities to prevent XSS attacks
 * Uses DOMPurify to safely render user-generated HTML content
 */

import DOMPurify from 'dompurify'

/**
 * Sanitizes HTML content to prevent XSS attacks
 * Only allows safe HTML tags like <strong>, <em>, <p>, <br>
 * @param html - Raw HTML string that may contain unsafe content
 * @returns Sanitized HTML string safe for rendering
 */
export function sanitizeHtml(html: string): string {
  // Configure DOMPurify to only allow safe formatting tags
  const config = {
    ALLOWED_TAGS: ['strong', 'em', 'b', 'i', 'p', 'br', 'span'],
    ALLOWED_ATTR: ['class'], // Only allow class attributes for styling
    KEEP_CONTENT: true, // Keep text content even if tags are removed
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false
  }

  return DOMPurify.sanitize(html, config)
}

/**
 * Safely highlights text by wrapping matches in <strong> tags
 * Escapes the input to prevent injection, then adds safe highlighting
 * @param text - Plain text to search within
 * @param highlight - Text to highlight (will be escaped)
 * @returns Safely highlighted HTML string
 */
export function safeHighlight(text: string, highlight: string): string {
  if (!highlight.trim()) {
    return escapeHtml(text)
  }

  // Escape both strings to prevent injection
  const escapedText = escapeHtml(text)
  const escapedHighlight = escapeHtml(highlight)

  // Create regex from escaped highlight text
  const regex = new RegExp(escapeRegExp(escapedHighlight), 'gi')

  // Replace with safe <strong> tags
  return escapedText.replace(regex, `<strong>${escapedHighlight}</strong>`)
}

/**
 * Escapes HTML characters to prevent injection
 * @param text - Text to escape
 * @returns HTML-escaped text
 */
export function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

/**
 * Escapes special regex characters
 * @param string - String to escape
 * @returns Regex-safe string
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
