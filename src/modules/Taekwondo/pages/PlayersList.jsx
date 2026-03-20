import React, { useState, useMemo } from 'react'
import { Card, Badge, Button, Input, Select } from '../../../shared/ui'
import { mockPlayers, mockTeams, mockEvents, mockParticipations } from '../data/mockData'
import { PlayerEditForm } from '../components/PlayerEditForm'
import { PlayerProfile } from './PlayerProfile'
import { calculatePlayerStats, getCopaChileStatus } from '../../../core/utils/playerStats'
import { TKD_WEIGHT_CATEGORIES } from '../../../core/config/sports/taekwondo'

export function PlayersList() {
  const [view, setView] = useState('list') // 'list' o 'ranking'
  const [rankingType, setRankingType] = useState('nacional') // 'nacional' o 'general'
  const [filters, setFilters] = useState({
    gender: '',
    ageGroup: '',
    weightCategory: '',
    teamId: '',
    search: ''
  })
  const [rankingFilters, setRankingFilters] = useState({
    gender: 'Varones',
    ageGroup: 'Cadetes',
    weightCategory: ''
  })

  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [editingPlayer, setEditingPlayer] = useState(null)
  const [showEditForm, setShowEditForm] = useState(false)

  // Opciones para filtros de lista
  const genderOptions = ['Varones', 'Damas']
  const ageGroupOptions = ['Cadetes', 'Juveniles', 'Adultos']
  
  const weightOptions = useMemo(() => {
    if (filters.gender && filters.ageGroup) {
      return TKD_WEIGHT_CATEGORIES[filters.gender]?.[filters.ageGroup] || []
    }
    const uniqueWeights = [...new Set(mockPlayers.map(p => p.weightCategory).filter(Boolean))]
    return uniqueWeights.sort()
  }, [filters.gender, filters.ageGroup])

  // Opciones para filtros de ranking
  const rankingWeightOptions = useMemo(() => {
    if (rankingFilters.gender && rankingFilters.ageGroup) {
      return TKD_WEIGHT_CATEGORIES[rankingFilters.gender]?.[rankingFilters.ageGroup] || []
    }
    return []
  }, [rankingFilters.gender, rankingFilters.ageGroup])

  // ==================== LÓGICA DE LISTA ====================
  // Filtrar deportistas para lista
  const filteredPlayers = useMemo(() => {
    let filtered = [...mockPlayers]

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

  // Ordenar por categoría para lista
  const sortedPlayers = useMemo(() => {
    const ageOrder = { Cadetes: 1, Juveniles: 2, Adultos: 3 }
    const genderOrder = { Varones: 1, Damas: 2 }

    return [...filteredPlayers].sort((a, b) => {
      const ageDiff = (ageOrder[a.ageGroup] || 99) - (ageOrder[b.ageGroup] || 99)
      if (ageDiff !== 0) return ageDiff
      const genderDiff = (genderOrder[a.gender] || 99) - (genderOrder[b.gender] || 99)
      if (genderDiff !== 0) return genderDiff
      const weightA = parseInt(a.weightCategory?.replace(/[^\d]/g, '')) || 0
      const weightB = parseInt(b.weightCategory?.replace(/[^\d]/g, '')) || 0
      return weightA - weightB
    })
  }, [filteredPlayers])

  // Agrupar por categoría para lista
  const groupedPlayers = useMemo(() => {
    const groups = {}
    sortedPlayers.forEach(player => {
      const key = `${player.ageGroup || 'Sin cat'} ${player.gender || ''}`.trim()
      if (!groups[key]) groups[key] = []
      groups[key].push(player)
    })
    return Object.entries(groups)
  }, [sortedPlayers])

  // ==================== LÓGICA DE RANKING ====================
  // Calcular ranking según tipo (nacional o general)
  const rankingData = useMemo(() => {
    // Filtrar por género, categoría y peso
    let filtered = mockPlayers.filter(p => {
      if (rankingFilters.gender && p.gender !== rankingFilters.gender) return false
      if (rankingFilters.ageGroup && p.ageGroup !== rankingFilters.ageGroup) return false
      if (rankingFilters.weightCategory && p.weightCategory !== rankingFilters.weightCategory) return false
      return true
    })

    // Calcular puntos para cada jugador según el tipo de ranking
    const playersWithPoints = filtered.map(player => {
      const stats = calculatePlayerStats(player.id, mockEvents, mockParticipations)
      const team = mockTeams.find(t => t.id === player.teamId)
      
      return {
        ...player,
        teamName: team?.name || 'Sin academia',
        points: rankingType === 'nacional' ? stats.leaguePoints : stats.totalPoints,
        eventsPlayed: rankingType === 'nacional' ? stats.leagueRoundsPlayed : stats.totalEvents,
        victories: rankingType === 'nacional' ? stats.leagueVictories : stats.totalVictories,
        gold: rankingType === 'nacional' ? stats.leagueGold : stats.totalGold,
        silver: rankingType === 'nacional' ? stats.leagueSilver : stats.totalSilver,
        bronze: rankingType === 'nacional' ? stats.leagueBronze : stats.totalBronze
      }
    })

    // Ordenar por puntos (mayor a menor)
    return playersWithPoints.sort((a, b) => b.points - a.points)
  }, [rankingFilters, rankingType])

  // Limpiar filtros de lista
  const clearFilters = () => {
    setFilters({
      gender: '',
      ageGroup: '',
      weightCategory: '',
      teamId: '',
      search: ''
    })
  }

  // Limpiar filtros de ranking
  const clearRankingFilters = () => {
    setRankingFilters({
      gender: 'Varones',
      ageGroup: 'Cadetes',
      weightCategory: ''
    })
  }

  // Obtener nombre de academia
  const getTeamName = (teamId) => {
    const team = mockTeams.find(t => t.id === teamId)
    return team?.name || 'Sin academia'
  }

  // Guardar deportista editado
  const handleSavePlayer = (updatedPlayer) => {
    if (editingPlayer) {
      const index = mockPlayers.findIndex(p => p.id === editingPlayer.id)
      if (index !== -1) {
        mockPlayers[index] = { ...mockPlayers[index], ...updatedPlayer }
      }
    } else {
      mockPlayers.push(updatedPlayer)
    }
    setShowEditForm(false)
    setEditingPlayer(null)
    setFilters({ ...filters })
  }

  // Eliminar deportista
  const handleDeletePlayer = (playerId, playerName) => {
    if (confirm(`¿Eliminar a ${playerName}?`)) {
      const index = mockPlayers.findIndex(p => p.id === playerId)
      if (index !== -1) {
        mockPlayers.splice(index, 1)
        setFilters({ ...filters })
      }
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '28px', color: 'var(--accent-tkd)' }}>
          🥋 DEPORTISTAS
        </h1>
        <Button variant="primary" onClick={() => {
          setEditingPlayer(null)
          setShowEditForm(true)
        }}>
          + Nuevo deportista
        </Button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <Button 
          variant={view === 'list' ? 'primary' : 'ghost'} 
          onClick={() => setView('list')}
        >
          📋 Lista de deportistas
        </Button>
        <Button 
          variant={view === 'ranking' ? 'primary' : 'ghost'} 
          onClick={() => setView('ranking')}
        >
          🏆 Ranking de deportistas
        </Button>
      </div>

      {/* ==================== VISTA LISTA ==================== */}
      {view === 'list' && (
        <>
          {/* Filtros */}
          <Card style={{ marginBottom: '24px' }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
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
                options={mockTeams.map(t => ({ value: t.id, label: t.name }))}
              />
            </div>

            {(filters.gender || filters.ageGroup || filters.weightCategory || filters.teamId || filters.search) && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                ✕ Limpiar filtros
              </Button>
            )}
          </Card>

          {/* Listado de deportistas agrupados */}
          {groupedPlayers.length === 0 ? (
            <Card>
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>
                No hay deportistas que coincidan con los filtros
              </p>
            </Card>
          ) : (
            groupedPlayers.map(([group, players]) => (
              <div key={group} style={{ marginBottom: '24px' }}>
                <div style={{ 
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontSize: '18px',
                  color: 'var(--accent-tkd)',
                  marginBottom: '12px',
                  paddingLeft: '8px',
                  borderLeft: `4px solid var(--accent-tkd)`
                }}>
                  {group} · {players.length} deportistas
                </div>

                <div style={{ display: 'grid', gap: '12px' }}>
                  {players.map(player => {
                    const stats = calculatePlayerStats(player.id, mockEvents, mockParticipations)
                    const team = mockTeams.find(t => t.id === player.teamId)
                    
                    return (
                      <Card 
                        key={player.id} 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          gap: '16px',
                          cursor: 'pointer',
                          transition: 'transform 0.2s'
                        }}
                        onClick={() => setSelectedPlayer(player)}
                        onMouseEnter={e => e.currentTarget.style.transform = 'translateX(4px)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}
                      >
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          background: 'var(--bg-card)',
                          border: '2px solid var(--accent-tkd)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '24px',
                          flexShrink: 0,
                          overflow: 'hidden'
                        }}>
                          {player.photo ? (
                            <img 
                              src={player.photo} 
                              alt="" 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                          ) : (
                            '🥋'
                          )}
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px', 
                            flexWrap: 'wrap',
                            marginBottom: '4px'
                          }}>
                            <span style={{ fontWeight: 600, fontSize: '16px' }}>
                              {player.name}
                            </span>
                            {player.dan && (
                              <Badge color="var(--accent-tkd)" style={{ fontSize: '10px' }}>
                                {player.dan}
                              </Badge>
                            )}
                            {player.status !== 'Activo' && (
                              <Badge color="var(--accent-red)" style={{ fontSize: '10px' }}>
                                {player.status}
                              </Badge>
                            )}
                            {stats.leaguePoints > 0 && (
                              <Badge color="var(--accent-tkd)" style={{ fontSize: '10px' }}>
                                {stats.leaguePoints} pts
                              </Badge>
                            )}
                          </div>

                          <div style={{ 
                            display: 'flex', 
                            gap: '12px', 
                            fontSize: '13px',
                            color: 'var(--text-secondary)',
                            flexWrap: 'wrap'
                          }}>
                            <span>🏫 {team?.name || 'Sin academia'}</span>
                            <span>⚖️ {player.weightCategory || 'Sin peso'}</span>
                            <span>{player.gender} · {player.ageGroup}</span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => {
                              setEditingPlayer(player)
                              setShowEditForm(true)
                            }}
                            title="Editar deportista"
                          >
                            ✏️
                          </Button>
                          <Button 
                            variant="danger" 
                            size="sm" 
                            onClick={() => handleDeletePlayer(player.id, player.name)}
                            title="Eliminar deportista"
                          >
                            🗑️
                          </Button>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </div>
            ))
          )}
        </>
      )}

      {/* ==================== VISTA RANKING ==================== */}
      {view === 'ranking' && (
        <div>
          {/* Selector de tipo de ranking */}
          <Card style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  checked={rankingType === 'nacional'}
                  onChange={() => setRankingType('nacional')}
                />
                <span style={{ fontWeight: rankingType === 'nacional' ? 'bold' : 'normal', color: rankingType === 'nacional' ? 'var(--accent-tkd)' : 'var(--text-secondary)' }}>
                  🏆 Ranking Nacional (Liga)
                </span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  checked={rankingType === 'general'}
                  onChange={() => setRankingType('general')}
                />
                <span style={{ fontWeight: rankingType === 'general' ? 'bold' : 'normal', color: rankingType === 'general' ? 'var(--accent-blue)' : 'var(--text-secondary)' }}>
                  🌍 Ranking General (Todos los torneos)
                </span>
              </label>
            </div>
          </Card>

          {/* Filtros de ranking */}
          <Card style={{ marginBottom: '20px' }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '16px'
            }}>
              <Select
                label="Género"
                value={rankingFilters.gender}
                onChange={(e) => setRankingFilters({ ...rankingFilters, gender: e.target.value, weightCategory: '' })}
                options={genderOptions}
              />
              <Select
                label="Categoría"
                value={rankingFilters.ageGroup}
                onChange={(e) => setRankingFilters({ ...rankingFilters, ageGroup: e.target.value, weightCategory: '' })}
                options={ageGroupOptions}
              />
              <Select
                label="Peso"
                value={rankingFilters.weightCategory}
                onChange={(e) => setRankingFilters({ ...rankingFilters, weightCategory: e.target.value })}
                options={rankingWeightOptions}
              />
            </div>
            {(rankingFilters.gender || rankingFilters.ageGroup || rankingFilters.weightCategory) && (
              <div style={{ marginTop: '16px' }}>
                <Button variant="ghost" size="sm" onClick={clearRankingFilters}>
                  ✕ Limpiar filtros
                </Button>
              </div>
            )}
          </Card>

          {/* Tabla de ranking */}
          <Card glow glowColor={rankingType === 'nacional' ? 'var(--accent-tkd)' : 'var(--accent-blue)'}>
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ color: rankingType === 'nacional' ? 'var(--accent-tkd)' : 'var(--accent-blue)' }}>
                {rankingType === 'nacional' ? 'Ranking Nacional' : 'Ranking General'} · 
                {rankingFilters.gender} {rankingFilters.ageGroup} {rankingFilters.weightCategory}
              </h3>
              <Badge color="var(--text-secondary)">{rankingData.length} deportistas</Badge>
            </div>

            {rankingData.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px' }}>
                No hay deportistas en esta categoría
              </p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-card)' }}>
                      <th style={{ padding: '12px 8px', textAlign: 'center', color: 'var(--text-secondary)' }}>#</th>
                      <th style={{ padding: '12px 8px', textAlign: 'left', color: 'var(--text-secondary)' }}>Deportista</th>
                      <th style={{ padding: '12px 8px', textAlign: 'left', color: 'var(--text-secondary)' }}>Academia</th>
                      <th style={{ padding: '12px 8px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        {rankingType === 'nacional' ? 'Fechas' : 'Eventos'}
                      </th>
                      <th style={{ padding: '12px 8px', textAlign: 'center', color: 'var(--text-secondary)' }}>Victorias</th>
                      <th style={{ padding: '12px 8px', textAlign: 'center', color: 'var(--text-secondary)' }}>🥇</th>
                      <th style={{ padding: '12px 8px', textAlign: 'center', color: 'var(--text-secondary)' }}>🥈</th>
                      <th style={{ padding: '12px 8px', textAlign: 'center', color: 'var(--text-secondary)' }}>🥉</th>
                      <th style={{ padding: '12px 8px', textAlign: 'center', color: 'var(--text-secondary)' }}>Puntos</th>
                      {rankingType === 'nacional' && (
                        <th style={{ padding: '12px 8px', textAlign: 'center', color: 'var(--text-secondary)' }}>Copa Chile</th>
                      )}
                     </tr>
                  </thead>
                  <tbody>
                    {rankingData.map((player, index) => {
                      const copaStatus = rankingType === 'nacional' ? getCopaChileStatus(index + 1, player.eventsPlayed) : null
                      
                      return (
                        <tr 
                          key={player.id} 
                          style={{ 
                            borderBottom: '1px solid var(--border)',
                            cursor: 'pointer',
                            background: index < 3 ? `${rankingType === 'nacional' ? 'var(--accent-tkd)' : 'var(--accent-blue)'}11` : 'transparent'
                          }}
                          onClick={() => setSelectedPlayer(player)}
                        >
                          <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                            <span style={{
                              fontWeight: 'bold',
                              color: index === 0 ? 'var(--accent-gold)' : 
                                     index === 1 ? '#bdc3c7' : 
                                     index === 2 ? '#cd7f32' : 'var(--text-secondary)'
                            }}>
                              {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                            </span>
                           </td>
                          <td style={{ padding: '12px 8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {player.photo ? (
                                <img 
                                  src={player.photo} 
                                  alt="" 
                                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} 
                                />
                              ) : (
                                <span style={{ fontSize: '20px' }}>🥋</span>
                              )}
                              <div>
                                <div style={{ fontWeight: 600 }}>{player.name}</div>
                                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{player.dan}</div>
                              </div>
                            </div>
                           </td>
                          <td style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>
                            {player.teamName}
                           </td>
                          <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                            {player.eventsPlayed}
                           </td>
                          <td style={{ padding: '12px 8px', textAlign: 'center', color: 'var(--accent-green)' }}>
                            {player.victories}
                           </td>
                          <td style={{ padding: '12px 8px', textAlign: 'center', color: 'var(--accent-gold)' }}>
                            {player.gold}
                           </td>
                          <td style={{ padding: '12px 8px', textAlign: 'center', color: '#bdc3c7' }}>
                            {player.silver}
                           </td>
                          <td style={{ padding: '12px 8px', textAlign: 'center', color: '#cd7f32' }}>
                            {player.bronze}
                           </td>
                          <td style={{ padding: '12px 8px', textAlign: 'center', fontWeight: 'bold', color: rankingType === 'nacional' ? 'var(--accent-tkd)' : 'var(--accent-blue)' }}>
                            {player.points}
                           </td>
                          {rankingType === 'nacional' && (
                            <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                              <Badge color={copaStatus?.color || 'var(--text-secondary)'}>
                                {copaStatus?.label || '—'}
                              </Badge>
                             </td>
                          )}
                         </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Modal de edición de deportista */}
      {showEditForm && (
        <PlayerEditForm
          player={editingPlayer}
          teams={mockTeams}
          onSave={handleSavePlayer}
          onClose={() => {
            setShowEditForm(false)
            setEditingPlayer(null)
          }}
        />
      )}

      {/* Modal de perfil */}
      {selectedPlayer && (
        <PlayerProfile 
          player={selectedPlayer} 
          onClose={() => setSelectedPlayer(null)}
          onEdit={() => {
            setFilters({ ...filters })
          }}
        />
      )}
    </div>
  )
}