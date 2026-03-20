import React, { useState } from 'react'
import { Button, Input, Select } from '../../../shared/ui'
import { PhotoUpload } from '../../../shared/ui/PhotoUpload'
import { TKD_WEIGHT_CATEGORIES, DAN_GRADES, REGIONS, PLAYER_STATUS } from '../../../core/config/sports/taekwondo'

export function PlayerEditForm({ player, teams, onSave, onClose }) {
  const [form, setForm] = useState({
    id: player?.id || '',
    name: player?.name || '',
    gender: player?.gender || 'Varones',
    ageGroup: player?.ageGroup || 'Cadetes',
    weightCategory: player?.weightCategory || '',
    teamId: player?.teamId || '',
    dan: player?.dan || '',
    status: player?.status || 'Activo',
    photo: player?.photo || null,
    birthDate: player?.birthDate || '',
    rut: player?.rut || '',
    region: player?.region || '',
    phone: player?.phone || ''
  })

  const [weightOptions, setWeightOptions] = useState(
    TKD_WEIGHT_CATEGORIES[form.gender]?.[form.ageGroup] || []
  )

  const handleGenderChange = (value) => {
    setForm({ ...form, gender: value, weightCategory: '' })
    setWeightOptions(TKD_WEIGHT_CATEGORIES[value]?.[form.ageGroup] || [])
  }

  const handleAgeChange = (value) => {
    setForm({ ...form, ageGroup: value, weightCategory: '' })
    setWeightOptions(TKD_WEIGHT_CATEGORIES[form.gender]?.[value] || [])
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!form.name) {
      alert('El nombre es obligatorio')
      return
    }
    
    onSave({
      ...form,
      id: form.id || `player_${Date.now()}`
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
            {player ? '✏️ Editar deportista' : '➕ Nuevo deportista'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '24px', cursor: 'pointer' }}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '16px' }}>
            
            <PhotoUpload
              photo={form.photo}
              onPhoto={(photo) => setForm({ ...form, photo })}
              label="Foto de perfil"
            />
            
            <Input
              label="Nombre completo *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ej: Pedro González"
              required
            />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Input
                label="Fecha de nacimiento"
                type="date"
                value={form.birthDate}
                onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
              />
              <Input
                label="RUT / ID"
                value={form.rut}
                onChange={(e) => setForm({ ...form, rut: e.target.value })}
                placeholder="12.345.678-9"
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Select
                label="Género"
                value={form.gender}
                onChange={(e) => handleGenderChange(e.target.value)}
                options={['Varones', 'Damas']}
              />
              <Select
                label="Categoría"
                value={form.ageGroup}
                onChange={(e) => handleAgeChange(e.target.value)}
                options={['Cadetes', 'Juveniles', 'Adultos']}
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Select
                label="Categoría de peso"
                value={form.weightCategory}
                onChange={(e) => setForm({ ...form, weightCategory: e.target.value })}
                options={weightOptions}
              />
              <Select
                label="Grado"
                value={form.dan}
                onChange={(e) => setForm({ ...form, dan: e.target.value })}
                options={DAN_GRADES}
              />
            </div>
            
            <Select
              label="Academia"
              value={form.teamId}
              onChange={(e) => setForm({ ...form, teamId: e.target.value })}
              options={teams.map(t => ({ value: t.id, label: t.name }))}
            />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Select
                label="Región"
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
                options={REGIONS}
              />
              <Select
                label="Estado"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                options={PLAYER_STATUS}
              />
            </div>
            
            <Input
              label="Teléfono de emergencia"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+56 9 1234 5678"
            />
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary">
                {player ? 'Actualizar' : 'Crear deportista'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}