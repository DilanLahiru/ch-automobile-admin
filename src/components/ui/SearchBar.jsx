
import React from 'react'
import { Search } from 'lucide-react'

export function SearchBar({
  className = '',
  onSearch,
  ...props
}) {
  return (
    <div className={`relative ${className}`}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      <input
        type="text"
        className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        placeholder="Search..."
        onChange={(e) => onSearch?.(e.target.value)}
        {...props}
      />
    </div>
  )
}
