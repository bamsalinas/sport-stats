import React from 'react'

export function Badge({ children, color = '#00e5ff', style = {} }) {
  return (
    <span style={{
      background: `${color}22`,
      border: `1px solid ${color}55`,
      color,
      borderRadius: 4,
      padding: '2px 8px',
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: 1,
      textTransform: 'uppercase',
      display: 'inline-block',
      ...style
    }}>
      {children}
    </span>
  )
}