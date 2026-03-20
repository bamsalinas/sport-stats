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
    <div className="app-header" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      width: '100%'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '56px'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '24px' }}>🥋</span>
          <span style={{ 
            fontWeight: 700, 
            fontSize: '18px',
            color: '#ffffff'
          }}>
            SPORT STATS
          </span>
          <Badge color="var(--league)" style={{ marginLeft: '4px' }}>TKD</Badge>
        </div>

        {/* Menú de navegación - íconos con colores originales */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              style={{
                background: 'transparent',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 12px',
                color: currentView === item.id ? 'var(--primary)' : 'rgba(255, 255, 255, 0.7)',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'color 0.15s'
              }}
              onMouseEnter={e => {
                if (currentView !== item.id) {
                  e.currentTarget.style.color = '#ffffff'
                }
              }}
              onMouseLeave={e => {
                if (currentView !== item.id) {
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'
                }
              }}
            >
              <span style={{ display: 'inline-block' }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
          
          {/* Botón Importar */}
          <button
            onClick={onImportClick}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '6px',
              padding: '6px 12px',
              color: 'rgba(255, 255, 255, 0.8)',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginLeft: '8px',
              transition: 'all 0.15s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--primary)'
              e.currentTarget.style.color = '#ffffff'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)'
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'
            }}
          >
            <span style={{ display: 'inline-block' }}>📥</span>
            <span>Importar</span>
          </button>
        </div>

        {/* Usuario */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 13, fontWeight: 500 }}>
            {user?.name || 'Admin'}
          </span>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14
          }}>
            👤
          </div>
        </div>
      </div>
    </div>
  )
}