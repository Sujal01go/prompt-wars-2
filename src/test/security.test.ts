import { describe, it, expect } from 'vitest'
import { sanitizeHtml, obfuscateKey, deobfuscateKey, maskApiKey } from '../utils/security.ts'

describe('Security & XSS Sanitization Tests', () => {
  it('strips dangerous scripts and malicious tags via DOMPurify', () => {
    const malicious = '<script>alert("xss")</script><img src="x" onerror="alert(1)"/><b>Safe</b>'
    const cleaned = sanitizeHtml(malicious)
    expect(cleaned).not.toContain('<script>')
    expect(cleaned).not.toContain('onerror')
    expect(cleaned).toContain('<b>Safe</b>')
  })

  it('permits safe semantic tags for formatted markdown output', () => {
    const safeHtml = '<h3>Protocol</h3><p>Wear <strong>N95</strong> respirator.</p>'
    const cleaned = sanitizeHtml(safeHtml)
    expect(cleaned).toContain('<h3>Protocol</h3>')
    expect(cleaned).toContain('<strong>N95</strong>')
  })

  it('correctly obfuscates and deobfuscates keys in local storage', () => {
    const rawKey = 'AIzaSyDemoKey1234567890'
    const obfuscated = obfuscateKey(rawKey)
    expect(obfuscated).not.toBe(rawKey)
    expect(deobfuscateKey(obfuscated)).toBe(rawKey)
  })

  it('masks sensitive API keys for safe UI display', () => {
    const key = 'AIzaSyA1B2C3D4E5F6G7H8I9J0'
    const masked = maskApiKey(key)
    expect(masked).toContain('••••••••')
    expect(masked.startsWith('AIzaSy')).toBe(true)
    expect(masked.endsWith('9J0')).toBe(true)
  })
})
