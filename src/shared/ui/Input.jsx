import React from 'react'

export function Input({ label, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {label && (
        <label style={{
          fontSize: 11,
          color: 'var(--text-secondary)',
          letterSpacing: 1,
          textTransform: 'uppercase',
          fontWeight: 600
        }}>
          {label}
        </label>
      )}
      <input
        {...props}
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 6,
          color: 'var(--text-primary)',
          padding: '8px 12px',
          fontSize: 14,
          outline: 'none',
          width: '100%',
          ...props.style
        }}
        onFocus={e => e.target.style.borderColor = 'var(--accent-blue)'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
      />
    </div>
  )
}