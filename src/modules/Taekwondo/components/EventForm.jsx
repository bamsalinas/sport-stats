import React, { useState } from 'react'
import { Button, Input, Select } from '../../../shared/ui'

const EVENT_TYPES = [
  { value: 'Torneo', label: 'Torneo' },
  { value: 'Encuentro', label: 'Encuentro' },
  { value: 'Entrenamiento', label: 'Entrenamiento' },
  { value: 'Otro', label: 'Otro' }
]

const EVENT_STATUS = [
  { value: 'Próximo', label: 'Próximo' },
  { value: 'En Curso', label: 'En Curso' },
  { value: 'Finalizado', label: 'Finalizado' },
  { value: 'Cancelado', label: 'Cancelado' }
]

export function EventForm({ event, onSave, onClose }) {
  const [form, setForm] = useState({
    id: event?.id || '',
    name: event?.name || '',
    type: event?.type || 'Torneo',
    date: event?.date || '',
    endDate: event?.endDate || '',
    location: event?.location || '',
    status: event?.status || 'Próximo',
    isLeagueEvent: event?.isLeagueEvent || false,
    leagueRound: event?.leagueRound || '',
    description: event?.description || ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validaciones básicas
    if (!form.name || !form.date) {
      alert('El nombre y la fecha son obligatorios')
      return
    }

    // Crear objeto final
    const newEvent = {
      ...form,
      id: form.id || `evt_${Date.now()}`,
      leagueRound: form.isLeagueEvent ? form.leagueRound : null
    }

    onSave(newEvent)
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#000c',
      zIndex: 1000,
      overflowY: 'auto',
      padding: '20px'
    }} onClick={onClose}>
      <div style={{
        maxWidth: '600px',
        margin: '40px auto',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '24px'
      }} onClick={e => e.stopPropagation()}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ color: 'var(--accent-tkd)', margin: 0 }}>
            {event ? '✏️ Editar evento' : '➕ Nuevo evento'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '24px', cursor: 'pointer' }}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '20px' }}>
            
            {/* Nombre */}
            <Input
              label="Nombre del evento *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ej: 5° Fecha Liga Nacional"
              required
            />

            {/* Tipo de evento y Checkbox en dos columnas */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '2fr 1fr', 
              gap: '16px',
              alignItems: 'center'
            }}>
              {/* Tipo de evento */}
              <Select
                label="Tipo de evento"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                options={EVENT_TYPES}
              />

              {/* Checkbox de Liga Nacional (más pequeño) */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                marginTop: '24px',
                padding: '4px 8px',
                background: 'var(--bg-card)',
                borderRadius: '6px',
                border: '1px solid var(--border)'
              }}>
                <input
                  type="checkbox"
                  id="isLeagueEvent"
                  checked={form.isLeagueEvent}
                  onChange={(e) => setForm({ 
                    ...form, 
                    isLeagueEvent: e.target.checked,
                    leagueRound: e.target.checked ? form.leagueRound : ''
                  })}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <label 
                  htmlFor="isLeagueEvent" 
                  style={{ 
                    color: 'var(--text-primary)', 
                    cursor: 'pointer', 
                    fontSize: '13px',
                    fontWeight: 500
                  }}
                >
                  Liga Nacional
                </label>
              </div>
            </div>

            {/* Número de fecha (solo si es Liga) - Ahora más pequeño */}
            {form.isLeagueEvent && (
              <div style={{ width: '50%' }}>
                <Input
                  label="Número de fecha"
                  type="number"
                  min="1"
                  max="5"
                  value={form.leagueRound}
                  onChange={(e) => setForm({ ...form, leagueRound: e.target.value })}
                  placeholder="Ej: 5"
                />
              </div>
            )}

            {/* Fechas */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Input
                label="Fecha inicio *"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
              <Input
                label="Fecha término"
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              />
            </div>

            {/* Ubicación */}
            <Input
              label="Ubicación / Sede"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="Ej: Gimnasio Polideportivo Ñuñoa"
            />

            {/* Estado */}
            <Select
              label="Estado"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              options={EVENT_STATUS}
            />

            {/* Descripción */}
            <div>
              <label style={{ display: 'block', marginBottom: '4px', color: 'var(--text-secondary)', fontSize: '11px', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>
                Descripción / Notas
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows="4"
                style={{
                  width: '100%',
                  padding: '8px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
                placeholder="Información adicional..."
              />
            </div>

            {/* Botones */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary">
                {event ? 'Actualizar evento' : 'Crear evento'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}