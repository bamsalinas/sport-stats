import React from 'react'

export function Card({ children, glow = false, glowColor = '#3b82f6', style = {}, onClick }) {
  return (
    <div 
      className="card-base"
      style={{
        cursor: onClick ? 'pointer' : 'default',
        ...style
      }}
      onClick={onClick}
    >
      {children}
    </div>
  )
}