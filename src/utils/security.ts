import DOMPurify from 'dompurify'

/**
 * Sanitizes untrusted HTML/markdown string to prevent XSS attacks.
 */
export function sanitizeHtml(untrusted: string): string {
  if (!untrusted) return ''
  return DOMPurify.sanitize(untrusted, {
    ALLOWED_TAGS: [
      'b',
      'i',
      'em',
      'strong',
      'a',
      'p',
      'ul',
      'ol',
      'li',
      'br',
      'span',
      'div',
      'h3',
      'h4',
      'h5',
      'code',
      'pre',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
      'blockquote',
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style', 'title'],
  })
}

/**
 * Obfuscates a string with simple reversible encoding for non-plaintext local storage.
 * Note: Never store sensitive credentials unmasked in browser localStorage.
 */
export function obfuscateKey(plaintext: string): string {
  if (!plaintext) return ''
  try {
    return btoa(
      encodeURIComponent(plaintext).replace(/%([0-9A-F]{2})/g, (_, p1) =>
        String.fromCharCode(parseInt(p1, 16))
      )
    )
  } catch {
    return btoa(plaintext)
  }
}

/**
 * De-obfuscates stored key.
 */
export function deobfuscateKey(obfuscated: string): string {
  if (!obfuscated) return ''
  try {
    return decodeURIComponent(
      Array.prototype.map
        .call(atob(obfuscated), (c: string) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        })
        .join('')
    )
  } catch {
    try {
      return atob(obfuscated)
    } catch {
      return ''
    }
  }
}

/**
 * Masks an API key for safe UI presentation (e.g. AIzaSy...9xKz)
 */
export function maskApiKey(key: string): string {
  if (!key || key.length < 8) return '••••••••'
  return `${key.slice(0, 6)}••••••••${key.slice(-4)}`
}
