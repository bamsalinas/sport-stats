import React from 'react'

export function Modal({ title, onClose, children, wide = false }) {
  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000c',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        width: '100%',
        maxWidth: wide ? 740 : 500,
        maxHeight: '92vh',
        overflow: 'auto',
        boxShadow: '0 20px 60px #000a'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '14px 22px',
          borderBottom: '1px solid var(--border)',
          position: 'sticky',
          top: 0,
          background: 'var(--bg-secondary)',
          zIndex: 1
        }}>
          <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: 15 }}>
            {title}
          </h3>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: 22,
              lineHeight: 1
            }}
          >
            ×
          </button>
        </div>
        <div style={{ padding: 22 }}>
          {children}
        </div>
      </div>
    </div>
  )
}