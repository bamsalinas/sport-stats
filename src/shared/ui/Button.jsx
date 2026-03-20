import React from 'react'

const variants = {
  primary: {
    background: 'rgba(59, 130, 246, 0.9)',
    border: '1px solid rgba(59, 130, 246, 0.6)',
    color: '#fff'
  },
  success: {
    background: 'rgba(16, 185, 129, 0.9)',
    border: '1px solid rgba(16, 185, 129, 0.6)',
    color: '#fff'
  },
  danger: {
    background: 'rgba(239, 68, 68, 0.9)',
    border: '1px solid rgba(239, 68, 68, 0.6)',
    color: '#fff'
  },
  ghost: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: '#fff'
  },
  accent: {
    background: 'rgba(139, 92, 246, 0.9)',
    border: '1px solid rgba(139, 92, 246, 0.6)',
    color: '#fff'
  },
  warning: {
    background: 'rgba(245, 158, 11, 0.9)',
    border: '1px solid rgba(245, 158, 11, 0.6)',
    color: '#fff'
  }
}

const sizes = {
  sm: { padding: '6px 12px', fontSize: 12 },
  md: { padding: '8px 16px', fontSize: 13 },
  lg: { padding: '10px 20px', fontSize: 14 }
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  style = {}, 
  disabled = false,
  onClick 
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        border: 'none',
        borderRadius: 'var(--radius-md)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontWeight: 500,
        fontFamily: 'inherit',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.15s',
        ...variants[variant],
        ...sizes[size],
        ...style
      }}
    >
      {children}
    </button>
  )
}