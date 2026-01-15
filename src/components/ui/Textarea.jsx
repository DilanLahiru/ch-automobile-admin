import React, { forwardRef } from 'react'

export const Textarea = forwardRef(({
  value,
  onChange,
  placeholder = '',
  error,
  disabled = false,
  className = '',
  rows = 3,
  maxLength,
  required = false,
  ...props
}, ref) => {
  const handleChange = (e) => {
    if (maxLength && e.target.value.length > maxLength) return
    onChange(e.target.value)
  }

  return (
    <div className="relative">
      <textarea
        ref={ref}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className={`
          block w-full resize-y rounded-lg border px-3 py-2.5 text-sm
          transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2
          focus:ring-offset-1 disabled:cursor-not-allowed disabled:bg-gray-50
          disabled:text-gray-400
          ${error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
          }
          ${className}
        `}
        {...props}
      />

      {maxLength && (
        <div className="absolute bottom-2 right-2 text-xs text-gray-400">
          {value?.length || 0}/{maxLength}
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {required && !value && (
        <span className="absolute -top-2 right-2 rounded bg-white px-1 text-xs text-gray-500">
          Required
        </span>
      )}
    </div>
  )
})

Textarea.displayName = 'Textarea'