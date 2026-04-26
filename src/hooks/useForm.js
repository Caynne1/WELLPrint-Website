import { useState, useCallback } from 'react'
import { validate as runValidate, hasErrors } from '../utils/validators'

/**
 * Reusable form state + validation hook.
 *
 * Usage:
 *   const { form, errors, setField, setFile, validateAll, resetForm } = useForm(
 *     { name: '', email: '', phone: '', file: null },
 *     {
 *       name:  [v => required(v, 'Full name')],
 *       email: [v => required(v, 'Email'), email],
 *       phone: [v => required(v, 'Phone'), phone],
 *       file:  [f => maxFileSize(f)],
 *     }
 *   )
 *
 *   <input value={form.name} onChange={setField('name')} />
 *   {errors.name && <span>{errors.name}</span>}
 *
 *   function handleSubmit(e) {
 *     e.preventDefault()
 *     if (!validateAll()) return
 *     // submit form...
 *   }
 */
export default function useForm(initialValues, validationSchema = {}) {
  const [form, setForm] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  // Set a text/select field from an event
  const setField = useCallback(
    (key) => (e) => {
      const value = e?.target?.value ?? e
      setForm((prev) => ({ ...prev, [key]: value }))
      // Clear error on edit
      setErrors((prev) => {
        if (!prev[key]) return prev
        const next = { ...prev }
        delete next[key]
        return next
      })
    },
    []
  )

  // Set a file input
  const setFile = useCallback(
    (key) => (e) => {
      const file = e?.target?.files?.[0] || null
      setForm((prev) => ({ ...prev, [key]: file }))
      setErrors((prev) => {
        if (!prev[key]) return prev
        const next = { ...prev }
        delete next[key]
        return next
      })
    },
    []
  )

  // Mark field as touched (for showing errors on blur)
  const touchField = useCallback(
    (key) => () => {
      setTouched((prev) => ({ ...prev, [key]: true }))
    },
    []
  )

  // Validate a single field
  const validateField = useCallback(
    (key) => {
      const rules = validationSchema[key]
      if (!rules) return null

      for (const rule of rules) {
        const error = rule(form[key])
        if (error) {
          setErrors((prev) => ({ ...prev, [key]: error }))
          return error
        }
      }
      setErrors((prev) => {
        const next = { ...prev }
        delete next[key]
        return next
      })
      return null
    },
    [form, validationSchema]
  )

  // Validate all fields — returns true if valid
  const validateAll = useCallback(() => {
    const result = runValidate(form, validationSchema)
    setErrors(result)
    // Mark all as touched
    const allTouched = {}
    for (const key of Object.keys(validationSchema)) {
      allTouched[key] = true
    }
    setTouched(allTouched)
    return !hasErrors(result)
  }, [form, validationSchema])

  // Reset to initial state
  const resetForm = useCallback(() => {
    setForm(initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  // Bulk update
  const setValues = useCallback((partial) => {
    setForm((prev) => ({ ...prev, ...partial }))
  }, [])

  return {
    form,
    errors,
    touched,
    setField,
    setFile,
    setValues,
    touchField,
    validateField,
    validateAll,
    resetForm,
    isValid: !hasErrors(errors),
  }
}
