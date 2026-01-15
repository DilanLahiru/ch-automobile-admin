
import React from 'react'

export function Badge({
  children,
  variant = 'default',
  className = '',
  size = 'md',
}) {
  const variants = {
    default: 'bg-blue-100 text-blue-700 border-blue-200',
    success: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-100 text-amber-700 border-amber-200',
    error: 'bg-red-100 text-red-700 border-red-200',
    info: 'bg-sky-100 text-sky-700 border-sky-200',
    neutral: 'bg-gray-100 text-gray-700 border-gray-200',
    secondary: 'bg-gray-100 text-gray-700 border-gray-200',
  }

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-0.5',
  }

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border font-medium ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  )
}
