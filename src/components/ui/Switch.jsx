import React from 'react'

export function Switch({
  checked,
  onChange,
  disabled = false,
  label,
  description,
  className = '',
}) {
  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked)
    }
  }

  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={handleToggle}
        className={`
          relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full
          border-2 border-transparent transition-colors duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${disabled ? 'cursor-not-allowed opacity-50' : ''}
          ${checked ? 'bg-blue-600' : 'bg-gray-200'}
        `}
      >
        <span
          className={`
            pointer-events-none inline-block h-5 w-5 transform rounded-full
            bg-white shadow ring-0 transition duration-200 ease-in-out
            ${checked ? 'translate-x-5' : 'translate-x-0'}
          `}
        />
      </button>

      {(label || description) && (
        <div className="flex flex-col gap-1">
          {label && (
            <label
              className={`
                text-sm font-medium leading-none
                ${disabled ? 'cursor-not-allowed text-gray-400' : 'text-gray-900'}
              `}
              onClick={handleToggle}
            >
              {label}
            </label>
          )}
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>
      )}
    </div>
  )
}