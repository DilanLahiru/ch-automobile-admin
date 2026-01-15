
import React from 'react'
import { motion } from 'framer-motion'

export function Card({
  children,
  className = '',
  title,
  description,
  footer,
  noPadding = false,
  onClick,
}) {
  const Wrapper = onClick ? motion.div : 'div'

  return (
    <Wrapper
      className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} ${className}`}
      onClick={onClick}
      {...(onClick
        ? {
            whileHover: {
              y: -2,
            },
            transition: {
              duration: 0.2,
            },
          }
        : {})}
    >
      {(title || description) && (
        <div className="px-6 py-5 border-b border-gray-100">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          )}
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
      )}
      <div className={noPadding ? '' : 'p-6'}>{children}</div>
      {footer && (
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
          {footer}
        </div>
      )}
    </Wrapper>
  )
}
