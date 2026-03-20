import React from 'react'
import { Badge } from '../ui'

export function Header({ currentView, onViewChange, onImportClick, user }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'players', label: 'Deportistas', icon: '🥋' },
    { id: 'teams', label: 'Academias', icon: '🏫' },
    { id: 'events', label: 'Eventos', icon: '📅' }
  ]

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '60px'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '24px' }}>🥋</span>
          <span style={{ 
            fontFamily: 'Barlow Condensed, sans-serif', 
            fontSize: '20px', 
            fontWeight: 800,
            color: 'var(--accent-tkd)'
          }}>
            SPORT STATS
          </span>
          <Badge color="var(--accent-tkd)" style={{ marginLeft: '8px' }}>Taekwondo</Badge>
        </div>

        {/* Menú de navegación */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              style={{
                background: currentView === item.id ? 'var(--accent-tkd)' : 'transparent',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 12px',
                color: currentView === item.id ? '#fff' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
          
          {/* Botón Importar destacado */}
          <button
            onClick={onImportClick}
            style={{
              background: 'var(--accent-blue)',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginLeft: '8px',
              transition: 'all 0.2s'
            }}
          >
            <span>📥</span>
            <span>Importar</span>
          </button>
        </div>

        {/* Usuario */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            {user?.name || 'Admin'}
          </span>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'var(--bg-card)',
            border: '2px solid var(--accent-tkd)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px'
          }}>
            👤
          </div>
        </div>
      </div>
    </div>
  )
}