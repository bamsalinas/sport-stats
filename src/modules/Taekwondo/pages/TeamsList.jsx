import React, { useState, useMemo } from 'react'
import { Card, Badge, Button, Input } from '../../../shared/ui'
import { mockPlayers, mockTeams, mockEvents, mockParticipations } from '../data/mockData'
import { TeamEditForm } from '../components/TeamEditForm'
import { calculateTeamStats } from '../../../core/utils/teamStats'
import { calculatePlayerStats } from '../../../core/utils/playerStats'

export function TeamsList() {
  const [search, setSearch] = useState('')
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [view, setView] = useState('list') // 'list' o 'ranking'
  const [rankingType, setRankingType] = useState('nacional') // 'nacional' o 'general'
  const [editingTeam, setEditingTeam] = useState(null)
  const [showEditForm, setShowEditForm] = useState(false)

  // Filtrar academias
  const filteredTeams = useMemo(() => {
    let filtered = [...mockTeams]
    
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(searchLower) ||
        t.city?.toLowerCase().includes(searchLower) ||
        t.region?.toLowerCase().includes(searchLower)
      )
    }
    
    return filtered
  }, [search])

  // Calcular estadísticas para cada academia (para vista lista - siempre nacional)
  const teamsWithStats = useMemo(() => {
    return filteredTeams.map(team => {
      const stats = calculateTeamStats(team.id, mockPlayers, mockEvents, mockParticipations)
      return { 
        ...team, 
        ...stats,
        totalPoints: stats.totalPoints || 0,
        gold: stats.gold || 0,
        silver: stats.silver || 0,
        bronze: stats.bronze || 0,
        totalPlayers: stats.totalPlayers || 0
      }
    })
  }, [filteredTeams])

  // Calcular ranking de academias según tipo (nacional o general)
  const ranking = useMemo(() => {
    const teamsRanking = mockTeams.map(team => {
      const teamPlayers = mockPlayers.filter(p => p.teamId === team.id)
      
      // Sumar puntos según el tipo de ranking
      let totalPoints = 0
      let gold = 0
      let silver = 0
      let bronze = 0
      let totalPlayers = teamPlayers.length
      
      teamPlayers.forEach(player => {
        const stats = calculatePlayerStats(player.id, mockEvents, mockParticipations)
        if (rankingType === 'nacional') {
          totalPoints += stats.leaguePoints || 0
          gold += stats.leagueGold || 0
          silver += stats.leagueSilver || 0
          bronze += stats.leagueBronze || 0
        } else {
          totalPoints += stats.totalPoints || 0
          gold += stats.totalGold || 0
          silver += stats.totalSilver || 0
          bronze += stats.totalBronze || 0
        }
      })
      
      return {
        ...team,
        totalPoints,
        gold,
        silver,
        bronze,
        totalPlayers,
        averagePoints: totalPlayers > 0 ? Math.round(totalPoints / totalPlayers) : 0
      }
    })
    
    return teamsRanking
      .filter(team => team.totalPlayers > 0)
      .sort((a, b) => b.totalPoints - a.totalPoints)
  }, [rankingType])

  // Estadísticas de la academia seleccionada (para vista detalle)
  const selectedTeamStats = useMemo(() => {
    if (!selectedTeam) return null
    return calculateTeamStats(selectedTeam.id, mockPlayers, mockEvents, mockParticipations)
  }, [selectedTeam])

  // Eliminar academia
  const handleDeleteTeam = (teamId, teamName) => {
    if (confirm(`¿Eliminar la academia ${teamName}? Esto también eliminará sus deportistas asociados.`)) {
      // Eliminar academia
      const teamIndex = mockTeams.findIndex(t => t.id === teamId)
      if (teamIndex !== -1) {
        mockTeams.splice(teamIndex, 1)
      }
      // Eliminar deportistas asociados
      const playersToDelete = mockPlayers.filter(p => p.teamId === teamId)
      playersToDelete.forEach(player => {
        const playerIndex = mockPlayers.findIndex(p => p.id === player.id)
        if (playerIndex !== -1) {
          mockPlayers.splice(playerIndex, 1)
        }
      })
      setSearch(search + ' ') // Forzar re-render
    }
  }

  // Guardar academia editada
  const handleSaveTeam = (updatedTeam) => {
    if (editingTeam) {
      const index = mockTeams.findIndex(t => t.id === editingTeam.id)
      if (index !== -1) {
        // Actualizar la academia existente
        mockTeams[index] = { ...mockTeams[index], ...updatedTeam }
      }
    } else {
      // Crear nueva academia
      mockTeams.push(updatedTeam)
    }
    setShowEditForm(false)
    setEditingTeam(null)
    setSearch(search + ' ') // Forzar re-render
  }

  return (
    <div style={{ padding: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '28px', color: 'var(--accent-tkd)' }}>
          🏫 ACADEMIAS
        </h1>
        <Button variant="primary" onClick={() => {
          setEditingTeam(null)
          setShowEditForm(true)
        }}>
          + Nueva academia
        </Button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <Button 
          variant={view === 'list' ? 'primary' : 'ghost'} 
          onClick={() => setView('list')}
        >
          📋 Lista de academias
        </Button>
        <Button 
          variant={view === 'ranking' ? 'primary' : 'ghost'} 
          onClick={() => setView('ranking')}
        >
          🏆 Ranking de academias
        </Button>
      </div>

      {/* Vista: Lista de academias */}
      {view === 'list' && (
        <>
          {/* Buscador */}
          <Card style={{ marginBottom: '24px' }}>
            <Input
              label="Buscar academia"
              placeholder="Nombre, ciudad o región..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Card>

          {/* Grid de academias */}
          <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {teamsWithStats.map(team => (
              <Card 
                key={team.id}
                glow
                glowColor="var(--accent-tkd)"
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedTeam(team)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  {/* Logo con foto */}
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'var(--bg-card)',
                    border: '2px solid var(--accent-tkd)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    overflow: 'hidden',
                    flexShrink: 0
                  }}>
                    {team.photo ? (
                      <img 
                        src={team.photo} 
                        alt="" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    ) : (
                      '🏫'
                    )}
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 4px 0' }}>{team.name}</h3>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {team.city || 'Ciudad no especificada'}, {team.region || 'Región no especificada'}
                    </div>
                  </div>
                </div>

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '8px',
                  textAlign: 'center',
                  marginBottom: '12px'
                }}>
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--accent-blue)' }}>
                      {team.totalPlayers || 0}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Deportistas</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--accent-tkd)' }}>
                      {team.totalPoints || 0}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Puntos</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--accent-gold)' }}>
                      {team.gold || 0} 🥇
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Oros</div>
                  </div>
                </div>

                {/* Botones de acción */}
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }} onClick={e => e.stopPropagation()}>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setEditingTeam(team)
                      setShowEditForm(true)
                    }}
                    title="Editar academia"
                  >
                    ✏️ Editar
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => handleDeleteTeam(team.id, team.name)}
                    title="Eliminar academia"
                  >
                    🗑️ Eliminar
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Vista: Ranking de academias */}
      {view === 'ranking' && (
        <div>
          {/* Selector de tipo de ranking */}
          <Card style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
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

          <Card glow glowColor={rankingType === 'nacional' ? 'var(--accent-tkd)' : 'var(--accent-blue)'}>
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ color: rankingType === 'nacional' ? 'var(--accent-tkd)' : 'var(--accent-blue)' }}>
                {rankingType === 'nacional' ? 'Ranking Nacional de Academias' : 'Ranking General de Academias'}
              </h3>
              <Badge color="var(--text-secondary)">{ranking.length} academias</Badge>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '12px 8px', textAlign: 'center', color: 'var(--text-secondary)' }}>#</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', color: 'var(--text-secondary)' }}>Academia</th>
                  <th style={{ padding: '12px 8px', textAlign: 'center', color: 'var(--text-secondary)' }}>Deportistas</th>
                  <th style={{ padding: '12px 8px', textAlign: 'center', color: 'var(--text-secondary)' }}>🥇</th>
                  <th style={{ padding: '12px 8px', textAlign: 'center', color: 'var(--text-secondary)' }}>🥈</th>
                  <th style={{ padding: '12px 8px', textAlign: 'center', color: 'var(--text-secondary)' }}>🥉</th>
                  <th style={{ padding: '12px 8px', textAlign: 'center', color: 'var(--text-secondary)' }}>Puntos</th>
                  <th style={{ padding: '12px 8px', textAlign: 'center', color: 'var(--text-secondary)' }}>Acciones</th>
                 </tr>
              </thead>
              <tbody>
                {ranking.map((team, index) => (
                  <tr key={team.id} style={{ borderBottom: '1px solid var(--border)' }}>
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
                        {team.photo ? (
                          <img 
                            src={team.photo} 
                            alt="" 
                            style={{ width: '28px', height: '28px', borderRadius: '6px', objectFit: 'cover' }} 
                          />
                        ) : (
                          <span style={{ fontSize: '20px' }}>🏫</span>
                        )}
                        <div>
                          <div style={{ fontWeight: 600 }}>{team.name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            {team.city || 'Ciudad no especificada'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 8px', textAlign: 'center' }}>{team.totalPlayers || 0}</td>
                    <td style={{ padding: '12px 8px', textAlign: 'center', color: 'var(--accent-gold)' }}>{team.gold || 0}</td>
                    <td style={{ padding: '12px 8px', textAlign: 'center', color: '#bdc3c7' }}>{team.silver || 0}</td>
                    <td style={{ padding: '12px 8px', textAlign: 'center', color: '#cd7f32' }}>{team.bronze || 0}</td>
                    <td style={{ padding: '12px 8px', textAlign: 'center', fontWeight: 'bold', color: rankingType === 'nacional' ? 'var(--accent-tkd)' : 'var(--accent-blue)' }}>
                      {team.totalPoints || 0}
                    </td>
                    <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setEditingTeam(team)
                            setShowEditForm(true)
                          }}
                          title="Editar academia"
                        >
                          ✏️
                        </Button>
                        <Button 
                          variant="danger" 
                          size="sm"
                          onClick={() => handleDeleteTeam(team.id, team.name)}
                          title="Eliminar academia"
                        >
                          🗑️
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {/* Modal de detalle de academia */}
      {selectedTeam && selectedTeamStats && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: '#000c',
          zIndex: 1000,
          overflowY: 'auto',
          padding: '20px'
        }} onClick={() => setSelectedTeam(null)}>
          <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '24px'
          }} onClick={e => e.stopPropagation()}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '12px',
                  background: 'var(--bg-card)',
                  border: '2px solid var(--accent-tkd)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  overflow: 'hidden'
                }}>
                  {selectedTeam.photo ? (
                    <img 
                      src={selectedTeam.photo} 
                      alt="" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  ) : (
                    '🏫'
                  )}
                </div>
                <div>
                  <h2 style={{ color: 'var(--accent-tkd)', margin: 0 }}>{selectedTeam.name}</h2>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {selectedTeam.city || 'Ciudad no especificada'}, {selectedTeam.region || 'Región no especificada'}
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedTeam(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '24px', cursor: 'pointer' }}>×</button>
            </div>

            {/* Stats rápidas */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '12px',
              marginBottom: '24px'
            }}>
              <Card style={{ textAlign: 'center', padding: '12px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--accent-blue)' }}>
                  {selectedTeamStats.totalPlayers || 0}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Deportistas</div>
              </Card>
              <Card style={{ textAlign: 'center', padding: '12px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--accent-tkd)' }}>
                  {selectedTeamStats.totalPoints || 0}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Puntos</div>
              </Card>
              <Card style={{ textAlign: 'center', padding: '12px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--accent-gold)' }}>
                  {selectedTeamStats.gold || 0}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>🥇 Oro</div>
              </Card>
              <Card style={{ textAlign: 'center', padding: '12px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--accent-green)' }}>
                  {selectedTeamStats.averagePoints || 0}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Promedio</div>
              </Card>
            </div>

            {/* Lista de deportistas */}
            <h3 style={{ marginBottom: '16px', color: 'var(--accent-tkd)' }}>Deportistas</h3>
            <div style={{ display: 'grid', gap: '12px', maxHeight: '400px', overflowY: 'auto' }}>
              {selectedTeamStats.players?.map(player => (
                <Card key={player.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{player.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {player.ageGroup} · {player.weightCategory || 'Sin peso'} · {player.dan || 'Sin grado'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold', color: 'var(--accent-tkd)' }}>
                      {player.totalPoints || 0} pts
                    </div>
                    <div style={{ fontSize: '11px' }}>
                      {player.gold || 0}🥇 {player.silver || 0}🥈 {player.bronze || 0}🥉
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <Button variant="ghost" onClick={() => setSelectedTeam(null)}>Cerrar</Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de edición de academia */}
      {showEditForm && (
        <TeamEditForm
          team={editingTeam}
          onSave={handleSaveTeam}
          onClose={() => {
            setShowEditForm(false)
            setEditingTeam(null)
          }}
        />
      )}
    </div>
  )
}