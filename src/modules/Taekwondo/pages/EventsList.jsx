import React, { useState, useMemo } from 'react'
import { Card, Badge, Button, Select, Input } from '../../../shared/ui'
import { mockEvents, mockPlayers, mockTeams, mockParticipations } from '../data/mockData'
import { formatDateRange } from '../../../core/utils/dates'
import { TKD_WEIGHT_CATEGORIES } from '../../../core/config/sports/taekwondo'
import { EventForm } from '../components/EventForm'

export function EventsList() {
  const [filter, setFilter] = useState('all')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showEventForm, setShowEventForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const handleDeleteEvent = (eventToDelete, e) => {
  e.stopPropagation() // Evitar que se abra el detalle del evento
  
  if (confirm(`¿Estás seguro de eliminar el evento "${eventToDelete.name}"?`)) {
    // 1. Eliminar participaciones asociadas
    const participationsToDelete = mockParticipations.filter(p => p.eventId === eventToDelete.id)
    const participationsCount = participationsToDelete.length
    
    // Eliminar de mockParticipations
    participationsToDelete.forEach(p => {
      const index = mockParticipations.findIndex(mp => 
        mp.eventId === p.eventId && mp.playerId === p.playerId
      )
      if (index !== -1) {
        mockParticipations.splice(index, 1)
      }
    })
    
    // 2. Eliminar el evento del array local
    const updatedEvents = events.filter(e => e.id !== eventToDelete.id)
    setEvents(updatedEvents)
    
    // 3. Eliminar también de mockEvents
    const mockIndex = mockEvents.findIndex(e => e.id === eventToDelete.id)
    if (mockIndex !== -1) {
      mockEvents.splice(mockIndex, 1)
    }
    
    // 4. Mostrar mensaje de confirmación
    alert(`✅ Evento eliminado correctamente.\nSe eliminaron ${participationsCount} participaciones asociadas.`)
  }
}
  // Forzar actualización cuando se agrega/edita un evento
  const [events, setEvents] = useState(mockEvents)

  const filteredEvents = useMemo(() => {
    if (filter === 'liga') {
      return events.filter(e => e.isLeagueEvent)
    }
    if (filter === 'torneo') {
      return events.filter(e => !e.isLeagueEvent)
    }
    return events
  }, [filter, events])

  const sortedEvents = useMemo(() => {
    return [...filteredEvents].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    )
  }, [filteredEvents])

  const handleSaveEvent = (newEvent) => {
    if (editingEvent) {
      // Editar evento existente
      const index = events.findIndex(e => e.id === editingEvent.id)
      if (index !== -1) {
        const updatedEvents = [...events]
        updatedEvents[index] = newEvent
        setEvents(updatedEvents)
        // Actualizar también mockEvents para mantener consistencia
        mockEvents[index] = newEvent
      }
    } else {
      // Agregar nuevo evento
      setEvents([...events, newEvent])
      mockEvents.push(newEvent)
    }
    
    setShowEventForm(false)
    setEditingEvent(null)
  }

  return (
    <div style={{ padding: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '28px', color: 'var(--accent-tkd)' }}>
          📅 EVENTOS
        </h1>
        <Button variant="primary" onClick={() => {
          setEditingEvent(null)
          setShowEventForm(true)
        }}>
          + Nuevo evento
        </Button>
      </div>

      {/* Filtros */}
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <Select
              label="Filtrar por tipo"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              options={[
                { value: 'all', label: 'Todos los eventos' },
                { value: 'liga', label: 'Solo Liga Nacional' },
                { value: 'torneo', label: 'Solo Torneos externos' }
              ]}
            />
          </div>
          <Badge color="var(--accent-blue)">{sortedEvents.length} eventos</Badge>
        </div>
      </Card>

      {/* Lista de eventos */}
      <div style={{ display: 'grid', gap: '16px' }}>
        {sortedEvents.map(event => (
          <Card 
            key={event.id}
            glow
            glowColor={event.isLeagueEvent ? 'var(--accent-tkd)' : 'var(--accent-blue)'}
            style={{ cursor: 'pointer' }}
            onClick={() => setSelectedEvent(event)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
              {/* Info del evento */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                  <h3 style={{ margin: 0 }}>{event.name}</h3>
                  <Badge color={event.isLeagueEvent ? 'var(--accent-tkd)' : 'var(--accent-blue)'}>
                    {event.isLeagueEvent ? `Liga - Fecha ${event.leagueRound}` : 'Torneo'}
                  </Badge>
                  <Badge color={
                    event.status === 'Finalizado' ? 'var(--accent-green)' :
                    event.status === 'Próximo' ? 'var(--accent-gold)' :
                    'var(--text-secondary)'
                  }>
                    {event.status}
                  </Badge>
                </div>
                
                <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                  <span>📅 {formatDateRange(event.date, event.endDate)}</span>
                  {event.location && <span>📍 {event.location}</span>}
                </div>
              </div>

              {/* Estadísticas y acciones */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--accent-blue)' }}>
                    {mockParticipations.filter(p => p.eventId === event.id).length}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Participaciones</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--accent-green)' }}>
                    {new Set(mockParticipations
                        .filter(p => p.eventId === event.id)
                        .map(p => p.playerId)
                    ).size}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Deportistas</div>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                    <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation()
                        setEditingEvent(event)
                        setShowEventForm(true)
                    }}
                    title="Editar evento"
                    >
                    ✏️
                    </Button>
                    <Button 
                    variant="danger" 
                    size="sm"
                    onClick={(e) => handleDeleteEvent(event, e)}
                    title="Eliminar evento"
                    >
                    🗑️
                    </Button>
                </div>
                </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal de detalle de evento */}
      {selectedEvent && (
        <EventDetail 
          event={selectedEvent} 
          onClose={() => setSelectedEvent(null)} 
        />
      )}

      {/* Modal de formulario de evento */}
      {showEventForm && (
        <EventForm
          event={editingEvent}
          onSave={handleSaveEvent}
          onClose={() => {
            setShowEventForm(false)
            setEditingEvent(null)
          }}
        />
      )}
    </div>
  )
}

function EventDetail({ event, onClose }) {
  const [participations, setParticipations] = useState(() => {
    return mockParticipations.filter(p => p.eventId === event.id)
  })

  const [filters, setFilters] = useState({
    gender: '',
    ageGroup: '',
    weightCategory: '',
    teamId: '',
    search: ''
  })

  const [bulkFilters, setBulkFilters] = useState({
    gender: '',
    ageGroup: '',
    weightCategory: ''
  })

  const [selectedTeamId, setSelectedTeamId] = useState('')
  const [editingParticipation, setEditingParticipation] = useState(null)
  const [showBulkLoad, setShowBulkLoad] = useState(false)

  const players = mockPlayers
  const teams = mockTeams

  const genderOptions = ['Varones', 'Damas']
  const ageGroupOptions = ['Cadetes', 'Juveniles', 'Adultos']
  
  const weightOptions = useMemo(() => {
    if (filters.gender && filters.ageGroup) {
      return TKD_WEIGHT_CATEGORIES[filters.gender]?.[filters.ageGroup] || []
    }
    const uniqueWeights = [...new Set(players.map(p => p.weightCategory).filter(Boolean))]
    return uniqueWeights.sort()
  }, [filters.gender, filters.ageGroup])

  const bulkWeightOptions = useMemo(() => {
    if (bulkFilters.gender && bulkFilters.ageGroup) {
      return TKD_WEIGHT_CATEGORIES[bulkFilters.gender]?.[bulkFilters.ageGroup] || []
    }
    return []
  }, [bulkFilters.gender, bulkFilters.ageGroup])

  const filteredPlayers = useMemo(() => {
    let filtered = [...players]

    if (filters.gender) {
      filtered = filtered.filter(p => p.gender === filters.gender)
    }
    if (filters.ageGroup) {
      filtered = filtered.filter(p => p.ageGroup === filters.ageGroup)
    }
    if (filters.weightCategory) {
      filtered = filtered.filter(p => p.weightCategory === filters.weightCategory)
    }
    if (filters.teamId) {
      filtered = filtered.filter(p => p.teamId === filters.teamId)
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchLower)
      )
    }

    return filtered
  }, [filters])

  const hasParticipation = (playerId) => {
    return participations.some(p => p.playerId === playerId)
  }

  const getParticipation = (playerId) => {
    return participations.find(p => p.playerId === playerId)
  }

  const saveParticipation = (participation) => {
    const exists = participations.findIndex(p => p.playerId === participation.playerId)
    
    if (exists >= 0) {
      const updated = [...participations]
      updated[exists] = { ...updated[exists], ...participation }
      setParticipations(updated)
      
      // Actualizar mockParticipations
      const mockIndex = mockParticipations.findIndex(p => 
        p.eventId === participation.eventId && p.playerId === participation.playerId
      )
      if (mockIndex >= 0) {
        mockParticipations[mockIndex] = { ...mockParticipations[mockIndex], ...participation }
      }
    } else {
      setParticipations([...participations, participation])
      mockParticipations.push(participation)
    }
    setEditingParticipation(null)
  }

  const removeParticipation = (playerId) => {
    if (confirm('¿Eliminar este resultado?')) {
      setParticipations(participations.filter(p => p.playerId !== playerId))
      
      // Eliminar de mockParticipations
      const mockIndex = mockParticipations.findIndex(p => 
        p.eventId === event.id && p.playerId === playerId
      )
      if (mockIndex >= 0) {
        mockParticipations.splice(mockIndex, 1)
      }
    }
  }

  const clearFilters = () => {
    setFilters({
      gender: '',
      ageGroup: '',
      weightCategory: '',
      teamId: '',
      search: ''
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
        maxWidth: '1200px',
        margin: '0 auto',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '24px'
      }} onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ color: 'var(--accent-tkd)', margin: '0 0 8px 0' }}>{event.name}</h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Badge color={event.isLeagueEvent ? 'var(--accent-tkd)' : 'var(--accent-blue)'}>
                {event.isLeagueEvent ? `Liga - Fecha ${event.leagueRound}` : 'Torneo'}
              </Badge>
              <Badge color={event.status === 'Finalizado' ? 'var(--accent-green)' : 'var(--accent-gold)'}>
                {event.status}
              </Badge>
              <Badge color="var(--text-secondary)">{formatDateRange(event.date, event.endDate)}</Badge>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '24px', cursor: 'pointer' }}>×</button>
        </div>

        {/* Estadísticas */}
        <Card style={{ marginBottom: '24px' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '16px',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--accent-blue)' }}>
                {participations.length}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Participaciones</div>
            </div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--accent-green)' }}>
                {new Set(participations.map(p => p.playerId)).size}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Deportistas</div>
            </div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--accent-gold)' }}>
                {participations.filter(p => p.position === 1).length}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>🥇 Oro</div>
            </div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--accent-tkd)' }}>
                {participations.reduce((sum, p) => sum + (p.victories || 0), 0)}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Victorias</div>
            </div>
          </div>
        </Card>

        {/* Sección de carga masiva */}
        <Card style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, color: 'var(--accent-tkd)' }}>⚡ Carga masiva</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowBulkLoad(!showBulkLoad)}
            >
              {showBulkLoad ? '▼ Ocultar' : '▶ Mostrar'}
            </Button>
          </div>

          {showBulkLoad && (
            <div style={{ display: 'grid', gap: '20px' }}>
              
              {/* Opción 1: Todos los deportistas */}
              <div style={{
                padding: '16px',
                background: 'var(--bg-card)',
                borderRadius: '8px',
                border: '1px solid var(--accent-blue)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '20px' }}>📋</span>
                      <h4 style={{ margin: 0, color: 'var(--accent-blue)' }}>Todos los deportistas</h4>
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {players.length} deportistas disponibles · {
                        players.filter(p => !hasParticipation(p.id)).length
                      } sin cargar
                    </div>
                  </div>
                  <Button 
                    variant="primary" 
                    onClick={() => {
                      const newParticipations = players
                        .filter(p => !hasParticipation(p.id))
                        .map(p => ({
                          eventId: event.id,
                          playerId: p.id,
                          weighIn: false,
                          victories: 0,
                          position: null
                        }))
                      
                      if (newParticipations.length > 0) {
                        setParticipations([...participations, ...newParticipations])
                        mockParticipations.push(...newParticipations)
                        alert(`✅ Se agregaron ${newParticipations.length} deportistas`)
                      } else {
                        alert('Todos los deportistas ya están cargados')
                      }
                    }}
                  >
                    Cargar todos
                  </Button>
                </div>
              </div>

              {/* Opción 2: Por categoría con menús desplegables */}
              <div style={{
                padding: '16px',
                background: 'var(--bg-card)',
                borderRadius: '8px',
                border: '1px solid var(--accent-tkd)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '18px' }}>🏷️</span>
                  <h4 style={{ margin: 0, color: 'var(--accent-tkd)' }}>Por categoría</h4>
                </div>

                {/* Selectores de categoría */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  <Select
                    label="Género"
                    value={bulkFilters.gender}
                    onChange={(e) => setBulkFilters({ ...bulkFilters, gender: e.target.value, weightCategory: '' })}
                    options={genderOptions}
                  />

                  <Select
                    label="Categoría"
                    value={bulkFilters.ageGroup}
                    onChange={(e) => setBulkFilters({ ...bulkFilters, ageGroup: e.target.value, weightCategory: '' })}
                    options={ageGroupOptions}
                  />

                  <Select
                    label="Peso"
                    value={bulkFilters.weightCategory}
                    onChange={(e) => setBulkFilters({ ...bulkFilters, weightCategory: e.target.value })}
                    options={bulkWeightOptions}
                  />
                </div>

                {/* Botón de carga y contador */}
                {bulkFilters.gender && bulkFilters.ageGroup && bulkFilters.weightCategory && (
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '12px',
                    background: 'var(--bg-secondary)',
                    borderRadius: '8px'
                  }}>
                    {(() => {
                      const categoryPlayers = players.filter(p => 
                        p.gender === bulkFilters.gender &&
                        p.ageGroup === bulkFilters.ageGroup &&
                        p.weightCategory === bulkFilters.weightCategory
                      )
                      const alreadyLoaded = categoryPlayers.filter(p => 
                        participations.some(part => part.playerId === p.id)
                      ).length
                      const pending = categoryPlayers.length - alreadyLoaded

                      return (
                        <>
                          <div>
                            <div style={{ fontWeight: 600 }}>
                              {bulkFilters.gender} {bulkFilters.ageGroup} {bulkFilters.weightCategory}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                              {categoryPlayers.length} deportistas · {alreadyLoaded} cargados · {pending} pendientes
                            </div>
                          </div>
                          <Button 
                            variant="primary" 
                            size="sm"
                            onClick={() => {
                              const newParticipations = categoryPlayers
                                .filter(p => !hasParticipation(p.id))
                                .map(p => ({
                                  eventId: event.id,
                                  playerId: p.id,
                                  weighIn: false,
                                  victories: 0,
                                  position: null
                                }))
                              
                              if (newParticipations.length > 0) {
                                setParticipations([...participations, ...newParticipations])
                                mockParticipations.push(...newParticipations)
                                alert(`✅ Se agregaron ${newParticipations.length} deportistas`)
                              } else {
                                alert('Todos los deportistas de esta categoría ya están cargados')
                              }
                            }}
                            disabled={pending === 0}
                          >
                            {pending === 0 ? 'Completo' : `Cargar ${pending}`}
                          </Button>
                        </>
                      )
                    })()}
                  </div>
                )}
              </div>

              {/* Opción 3: Por academia con menú desplegable */}
              <div style={{
                padding: '16px',
                background: 'var(--bg-card)',
                borderRadius: '8px',
                border: '1px solid var(--accent-gold)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '18px' }}>🏫</span>
                  <h4 style={{ margin: 0, color: 'var(--accent-gold)' }}>Por academia</h4>
                </div>

                {/* Selector de academia */}
                <div style={{ marginBottom: '16px' }}>
                  <Select
                    label="Seleccionar academia"
                    value={selectedTeamId}
                    onChange={(e) => setSelectedTeamId(e.target.value)}
                    options={teams.map(t => ({ value: t.id, label: `${t.name} (${t.city})` }))}
                  />
                </div>

                {/* Botón de carga y contador */}
                {selectedTeamId && (
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '12px',
                    background: 'var(--bg-secondary)',
                    borderRadius: '8px'
                  }}>
                    {(() => {
                      const team = teams.find(t => t.id === selectedTeamId)
                      const teamPlayers = players.filter(p => p.teamId === selectedTeamId)
                      const alreadyLoaded = teamPlayers.filter(p => 
                        participations.some(part => part.playerId === p.id)
                      ).length
                      const pending = teamPlayers.length - alreadyLoaded

                      return (
                        <>
                          <div>
                            <div style={{ fontWeight: 600 }}>{team?.name}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                              {teamPlayers.length} deportistas · {alreadyLoaded} cargados · {pending} pendientes
                            </div>
                          </div>
                          <Button 
                            variant="primary" 
                            size="sm"
                            onClick={() => {
                              const newParticipations = teamPlayers
                                .filter(p => !hasParticipation(p.id))
                                .map(p => ({
                                  eventId: event.id,
                                  playerId: p.id,
                                  weighIn: false,
                                  victories: 0,
                                  position: null
                                }))
                              
                              if (newParticipations.length > 0) {
                                setParticipations([...participations, ...newParticipations])
                                mockParticipations.push(...newParticipations)
                                alert(`✅ Se agregaron ${newParticipations.length} deportistas de ${team?.name}`)
                              } else {
                                alert(`Todos los deportistas de ${team?.name} ya están cargados`)
                              }
                            }}
                            disabled={pending === 0}
                          >
                            {pending === 0 ? 'Completo' : `Cargar ${pending}`}
                          </Button>
                        </>
                      )
                    })()}
                  </div>
                )}
              </div>
            </div>
          )}
        </Card>

        {/* Filtros */}
        <Card style={{ marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 16px 0', color: 'var(--accent-tkd)' }}>🔍 Filtrar deportistas</h3>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '16px',
            marginBottom: '16px'
          }}>
            <Input
              label="Buscar"
              placeholder="Nombre..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />

            <Select
              label="Género"
              value={filters.gender}
              onChange={(e) => setFilters({ ...filters, gender: e.target.value, weightCategory: '' })}
              options={genderOptions}
            />

            <Select
              label="Categoría"
              value={filters.ageGroup}
              onChange={(e) => setFilters({ ...filters, ageGroup: e.target.value, weightCategory: '' })}
              options={ageGroupOptions}
            />

            <Select
              label="Peso"
              value={filters.weightCategory}
              onChange={(e) => setFilters({ ...filters, weightCategory: e.target.value })}
              options={weightOptions}
            />

            <Select
              label="Academia"
              value={filters.teamId}
              onChange={(e) => setFilters({ ...filters, teamId: e.target.value })}
              options={teams.map(t => ({ value: t.id, label: t.name }))}
            />
          </div>

          {(filters.gender || filters.ageGroup || filters.weightCategory || filters.teamId || filters.search) && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              ✕ Limpiar filtros
            </Button>
          )}

          <div style={{ marginTop: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            Mostrando {filteredPlayers.length} de {players.length} deportistas
          </div>
        </Card>

        {/* Tabla de resultados */}
        <Card>
          <div style={{ overflowX: 'auto', maxHeight: '500px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ position: 'sticky', top: 0, background: 'var(--bg-secondary)' }}>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '12px 8px', textAlign: 'left' }}>Deportista</th>
                  <th style={{ padding: '12px 8px', textAlign: 'center' }}>Academia</th>
                  <th style={{ padding: '12px 8px', textAlign: 'center' }}>Categoría</th>
                  <th style={{ padding: '12px 8px', textAlign: 'center' }}>Pesaje</th>
                  <th style={{ padding: '12px 8px', textAlign: 'center' }}>Victorias</th>
                  <th style={{ padding: '12px 8px', textAlign: 'center' }}>Posición</th>
                  <th style={{ padding: '12px 8px', textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlayers.map(player => {
                  const participation = getParticipation(player.id)
                  const team = teams.find(t => t.id === player.teamId)
                  
                  return (
                    <tr key={player.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 8px' }}>
                        <div style={{ fontWeight: 600 }}>{player.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{player.dan}</div>
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                        {team?.name || '—'}
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                        {player.gender} {player.ageGroup} {player.weightCategory}
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                        {participation ? (
                          participation.weighIn ? '✅' : '❌'
                        ) : '—'}
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                        {participation?.victories || 0}
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                        {participation?.position === 1 ? '🥇' :
                         participation?.position === 2 ? '🥈' :
                         participation?.position === 3 ? '🥉' : '—'}
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                        {!participation ? (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setEditingParticipation({
                              eventId: event.id,
                              playerId: player.id,
                              playerName: player.name,
                              weighIn: false,
                              victories: 0,
                              position: null
                            })}
                          >
                            + Cargar
                          </Button>
                        ) : (
                          <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setEditingParticipation({
                                ...participation,
                                playerName: player.name
                              })}
                            >
                              ✏️
                            </Button>
                            <Button 
                              variant="danger" 
                              size="sm"
                              onClick={() => removeParticipation(player.id)}
                            >
                              ×
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {editingParticipation && (
          <ParticipationForm
            participation={editingParticipation}
            onSave={saveParticipation}
            onClose={() => setEditingParticipation(null)}
          />
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
          <Button variant="primary" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  )
}

function ParticipationForm({ participation, onSave, onClose }) {
  const [form, setForm] = useState({
    eventId: participation.eventId,
    playerId: participation.playerId,
    weighIn: participation.weighIn || false,
    victories: participation.victories || 0,
    position: participation.position || null,
    status: participation.status || ''
  })

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#000c',
      zIndex: 1100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }} onClick={onClose}>
      <div style={{
        maxWidth: '400px',
        width: '100%',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '24px'
      }} onClick={e => e.stopPropagation()}>
        
        <h3 style={{ margin: '0 0 16px 0', color: 'var(--accent-tkd)' }}>
          Resultados: {participation.playerName}
        </h3>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={form.weighIn}
              onChange={(e) => setForm({ ...form, weighIn: e.target.checked })}
              style={{ width: '18px', height: '18px' }}
            />
            <span style={{ color: 'var(--text-primary)' }}>Pesaje OK</span>
          </label>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', color: 'var(--text-secondary)' }}>
            Victorias
          </label>
          <input
            type="number"
            min="0"
            max="10"
            value={form.victories}
            onChange={(e) => setForm({ ...form, victories: parseInt(e.target.value) || 0 })}
            style={{
              width: '100%',
              padding: '8px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              color: 'var(--text-primary)'
            }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '4px', color: 'var(--text-secondary)' }}>
            Posición final
          </label>
          <select
            value={form.position || ''}
            onChange={(e) => setForm({ ...form, position: e.target.value ? parseInt(e.target.value) : null })}
            style={{
              width: '100%',
              padding: '8px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              color: 'var(--text-primary)'
            }}
          >
            <option value="">Sin posición</option>
            <option value="1">🥇 1er lugar</option>
            <option value="2">🥈 2do lugar</option>
            <option value="3">🥉 3er lugar</option>
          </select>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '4px', color: 'var(--text-secondary)' }}>
            Estado especial
          </label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            style={{
              width: '100%',
              padding: '8px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              color: 'var(--text-primary)'
            }}
          >
            <option value="">Normal</option>
            <option value="No se presentó">No se presentó</option>
            <option value="Descalificado">Descalificado</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" onClick={() => onSave(form)}>Guardar</Button>
        </div>
      </div>
    </div>
  )
}