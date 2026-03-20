import React from 'react'

const variants = {
  primary: {
    background: 'linear-gradient(135deg, #0077b6, #00b4d8)',
    color: '#fff'
  },
  success: {
    background: 'linear-gradient(135deg, #1a7a4a, #27ae60)',
    color: '#fff'
  },
  danger: {
    background: 'transparent',
    border: '1px solid #c0392b55',
    color: '#e74c3c'
  },
  ghost: {
    background: 'transparent',
    border: '1px solid var(--border)',
    color: 'var(--text-secondary)'
  },
  accent: {
    background: 'linear-gradient(135deg, #7b2ff7, #a855f7)',
    color: '#fff'
  },
  warning: {
    background: 'linear-gradient(135deg, #b8860b, #f39c12)',
    color: '#fff'
  }
}

const sizes = {
  sm: { padding: '5px 11px', fontSize: 12 },
  md: { padding: '9px 18px', fontSize: 13 },
  lg: { padding: '12px 28px', fontSize: 14 }
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
        borderRadius: 6,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontWeight: 700,
        fontFamily: 'inherit',
        opacity: disabled ? 0.5 : 1,
        transition: 'opacity 0.15s, transform 0.1s',
        ...variants[variant],
        ...sizes[size],
        ...style
      }}
      onMouseDown={e => !disabled && (e.currentTarget.style.transform = 'scale(0.97)')}
      onMouseUp={e => !disabled && (e.currentTarget.style.transform = 'scale(1)')}
      onMouseLeave={e => !disabled && (e.currentTarget.style.transform = 'scale(1)')}
    >
      {children}
    </button>
  )
}