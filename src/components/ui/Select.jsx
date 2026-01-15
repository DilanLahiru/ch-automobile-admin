import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

export function Select({
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  error,
  disabled = false,
  className = '',
  required = false,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef(null)

  const selectedOption = options.find(opt => opt.value === value)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (option) => {
    onChange(option.value)
    setIsOpen(false)
  }

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      <button
        type="button"
        className={`
          flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-left text-sm
          transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1
          ${disabled
            ? 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400'
            : 'cursor-pointer border-gray-300 bg-white text-gray-900 hover:border-gray-400'
          }
          ${error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
            : 'focus:border-blue-500 focus:ring-blue-200'
          }
          ${isOpen ? 'border-gray-400 ring-2 ring-blue-200' : ''}
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <span className={`truncate ${!selectedOption ? 'text-gray-400' : ''}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`
            h-4 w-4 flex-shrink-0 transition-transform
            ${isOpen ? 'rotate-180' : ''}
            ${disabled ? 'text-gray-300' : 'text-gray-400'}
          `}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          {options.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-500">No options available</div>
          ) : (
            options.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`
                  flex w-full items-center justify-between px-3 py-2 text-sm
                  hover:bg-gray-50 focus:bg-gray-50 focus:outline-none
                  ${option.value === value ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}
                `}
                onClick={() => handleSelect(option)}
              >
                <span className="truncate">{option.label}</span>
                {option.value === value && (
                  <Check className="h-4 w-4 flex-shrink-0 text-blue-600" />
                )}
              </button>
            ))
          )}
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
}