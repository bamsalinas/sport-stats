import React from 'react'

export function Card({ children, glow = false, glowColor = '#00e5ff', style = {}, onClick }) {
  return (
    <div 
      style={{
        background: 'var(--bg-secondary)',
        border: `1px solid ${glow ? `${glowColor}33` : 'var(--border)'}`,
        borderRadius: 12,
        padding: 20,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        ...style
      }}
      onClick={onClick}
      onMouseEnter={glow ? e => {
        e.currentTarget.style.borderColor = glowColor
        e.currentTarget.style.boxShadow = `0 0 20px ${glowColor}33`
      } : null}
      onMouseLeave={glow ? e => {
        e.currentTarget.style.borderColor = '#1e3a5f33'
        e.currentTarget.style.boxShadow = 'none'
      } : null}
    >
      {children}
    </div>
  )
}