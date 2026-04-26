// ─── Individual validators ─────────────────────────────────────
// Each returns an error string or null

export function required(value, label = 'This field') {
  if (!value || !String(value).trim()) return `${label} is required`
  return null
}

export function email(value) {
  if (!value) return null // use required() separately
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
    return 'Enter a valid email address'
  }
  return null
}

export function phone(value) {
  if (!value) return null
  // Accept PH formats: 09XX, +639XX, (02) XXXX, landlines
  const cleaned = value.replace(/[\s\-().]/g, '')
  if (cleaned.length < 7 || !/^[+\d]{7,15}$/.test(cleaned)) {
    return 'Enter a valid phone number'
  }
  return null
}

export function minLength(value, min, label = 'This field') {
  if (!value) return null
  if (String(value).trim().length < min) {
    return `${label} must be at least ${min} characters`
  }
  return null
}

export function maxFileSize(file, maxBytes = 20 * 1024 * 1024) {
  if (!file) return null
  if (file.size > maxBytes) {
    const maxMB = Math.round(maxBytes / (1024 * 1024))
    return `File size exceeds ${maxMB}MB limit`
  }
  return null
}

export function fileType(file, allowedExtensions = []) {
  if (!file || allowedExtensions.length === 0) return null
  const ext = file.name.split('.').pop()?.toLowerCase()
  if (!ext || !allowedExtensions.includes(ext)) {
    return `Accepted formats: ${allowedExtensions.join(', ').toUpperCase()}`
  }
  return null
}

// ─── Schema-based validation ───────────────────────────────────
// Usage:
//   const errors = validate(form, {
//     name:  [v => required(v, 'Full name')],
//     email: [v => required(v, 'Email'), email],
//     phone: [v => required(v, 'Phone'), phone],
//     file:  [f => maxFileSize(f, 20 * 1024 * 1024)],
//   })
//
// Returns: { name: 'Full name is required', email: null, ... }
//          (only keys with errors)

export function validate(values, schema) {
  const errors = {}

  for (const [field, rules] of Object.entries(schema)) {
    for (const rule of rules) {
      const error = rule(values[field])
      if (error) {
        errors[field] = error
        break // stop at first error per field
      }
    }
  }

  return errors
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0
}
