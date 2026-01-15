
import React from 'react'

export function LoadingSkeleton({
  className = '',
  width,
  height,
  circle = false,
}) {
  return (
    <div
      className={`animate-pulse bg-gray-200 ${circle ? 'rounded-full' : 'rounded-md'} ${className}`}
      style={{
        width: width,
        height: height,
      }}
    />
  )
}
