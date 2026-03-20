import React from 'react'

export function Select({ label, options = [], value, onChange, ...props }) {
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
      <select
        value={value || ''}
        onChange={onChange}
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 6,
          color: value ? 'var(--text-primary)' : 'var(--text-secondary)',
          padding: '8px 12px',
          fontSize: 14,
          outline: 'none',
          cursor: 'pointer',
          width: '100%',
          ...props.style
        }}
        onFocus={e => e.target.style.borderColor = 'var(--accent-blue)'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
      >
        <option value="">— Seleccionar —</option>
        {options.map(opt => {
          if (typeof opt === 'string') {
            return <option key={opt} value={opt}>{opt}</option>
          }
          return <option key={opt.value} value={opt.value}>{opt.label}</option>
        })}
      </select>
    </div>
  )
}