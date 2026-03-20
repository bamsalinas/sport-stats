import React, { useState } from 'react'
import { Button, Input, Select } from '../../../shared/ui'
import { PhotoUpload } from '../../../shared/ui/PhotoUpload'
import { REGIONS } from '../../../core/config/sports/taekwondo'

export function TeamEditForm({ team, onSave, onClose }) {
  const [form, setForm] = useState({
    id: team?.id || '',
    name: team?.name || '',
    city: team?.city || '',
    region: team?.region || '',
    photo: team?.photo || null
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!form.name) {
      alert('El nombre de la academia es obligatorio')
      return
    }
    
    onSave({
      ...form,
      id: form.id || `team_${Date.now()}`
    })
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
        maxWidth: '500px',
        margin: '40px auto',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '24px'
      }} onClick={e => e.stopPropagation()}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ color: 'var(--accent-tkd)', margin: 0 }}>
            {team ? '✏️ Editar academia' : '➕ Nueva academia'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '24px', cursor: 'pointer' }}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '16px' }}>
            
            <PhotoUpload
              photo={form.photo}
              onPhoto={(photo) => setForm({ ...form, photo })}
              label="Logo / Escudo"
            />
            
            <Input
              label="Nombre de la academia *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ej: Team León"
              required
            />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Input
                label="Ciudad"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="Ej: Santiago"
              />
              <Select
                label="Región"
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
                options={REGIONS}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary">
                {team ? 'Actualizar academia' : 'Crear academia'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}