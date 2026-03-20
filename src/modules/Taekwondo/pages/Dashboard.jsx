import React, { useState, useMemo } from 'react'
import { Card, Badge, Button } from '../../../shared/ui'
import { mockPlayers, mockTeams, mockEvents, mockParticipations } from '../data/mockData'
import { calculatePlayerStats, getCopaChileStatus } from '../../../core/utils/playerStats'
import { calculateTeamsRanking } from '../../../core/utils/teamStats'
import { formatDateRange } from '../../../core/utils/dates'
import { TKD_WEIGHT_CATEGORIES, TOTAL_LEAGUE_ROUNDS } from '../../../core/config/sports/taekwondo'

export function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState({
    gender: 'Varones',
    ageGroup: 'Cadetes',
    weight: '-45kg'
  })

  // Estadísticas generales
  const stats = useMemo(() => {
    const leagueEvents = mockEvents.filter(e => e.isLeagueEvent && e.status === 'Finalizado')
    const upcomingEvents = mockEvents.filter(e => e.status === 'Próximo')
    const totalParticipations = mockParticipations.length
    const totalPlayers = mockPlayers.length
    const totalTeams = mockTeams.length

    return {
      totalPlayers,
      totalTeams,
      totalEvents: mockEvents.length,
      leagueRoundsCompleted: leagueEvents.length,
      upcomingEvents: upcomingEvents.length,
      totalParticipations,
      averageParticipation: totalPlayers > 0 ? Math.round(totalParticipations / totalPlayers) : 0
    }
  }, [])

  // Próximos eventos (top 3)
  const upcomingEvents = useMemo(() => {
    return mockEvents
      .filter(e => e.status === 'Próximo')
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 3)
  }, [])

  // Ranking de academias (top 5)
  const teamsRanking = useMemo(() => {
    const ranking = calculateTeamsRanking(mockTeams, mockPlayers, mockEvents, mockParticipations, 'nacional')
    return ranking.slice(0, 5).map(team => ({
      ...team,
      totalPoints: team.totalPoints || 0,
      gold: team.gold || 0,
      silver: team.silver || 0,
      bronze: team.bronze || 0
    }))
  }, [])

  // Top 4 ranking por categoría (Liga Nacional)
  const topRanking = useMemo(() => {
    const { gender, ageGroup, weight } = selectedCategory
    
    const categoryPlayers = mockPlayers.filter(p => 
      p.gender === gender &&
      p.ageGroup === ageGroup &&
      p.weightCategory === weight
    )

    const playersWithStats = categoryPlayers.map(player => {
      const stats = calculatePlayerStats(player.id, mockEvents, mockParticipations)
      const team = mockTeams.find(t => t.id === player.teamId)
      return { 
        ...player, 
        teamName: team?.name || 'Sin academia',
        points: stats.leaguePoints || 0,
        roundsPlayed: stats.leagueRoundsPlayed || 0,
        victories: stats.leagueVictories || 0
      }
    })

    return playersWithStats
      .sort((a, b) => b.points - a.points)
      .slice(0, 4)
  }, [selectedCategory])

  // Opciones para selector de categoría
  const weightOptions = TKD_WEIGHT_CATEGORIES[selectedCategory.gender]?.[selectedCategory.ageGroup] || []

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Header con título */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ 
          fontFamily: 'var(--font-heading)', 
          fontSize: '28px', 
          fontWeight: 700,
          color: 'var(--primary)',
          margin: '0 0 8px 0',
          letterSpacing: '-0.5px'
        }}>
          Panel de Control
        </h1>
        <p className="text-secondary" style={{ margin: 0, fontSize: '14px', fontWeight: 500 }}>
          Resumen general de la Liga Nacional y torneos
        </p>
      </div>

      {/* Eventos Recientes */}
      <div style={{ marginBottom: '24px' }}>
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ 
            padding: '16px 20px', 
            borderBottom: '2px solid rgba(255, 255, 255, 0.15)',
            background: 'rgba(0, 0, 0, 0.3)'
          }}>
            <h2 style={{ 
              margin: 0, 
              fontSize: '16px', 
              fontWeight: 600,
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>📅</span> Eventos Recientes
            </h2>
          </div>
          
          <div style={{ padding: '20px' }}>
            {upcomingEvents.length === 0 ? (
              <p className="text-secondary" style={{ textAlign: 'center', padding: '20px', fontWeight: 500 }}>
                No hay eventos próximos
              </p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="card-list-item" style={{ margin: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#ffffff' }}>
                          {event.name}
                        </h3>
                        <div className="text-secondary" style={{ fontSize: '12px', marginTop: '4px', fontWeight: 500 }}>
                          {event.isLeagueEvent ? 'Liga Nacional' : 'Torneo'} · {formatDateRange(event.date, event.endDate)}
                        </div>
                      </div>
                      <Badge color={event.isLeagueEvent ? 'var(--league)' : 'var(--primary)'}>
                        {event.isLeagueEvent ? `Fecha ${event.leagueRound}` : 'Próximo'}
                      </Badge>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginTop: '12px' }}>
                      <div className="stat-card" style={{ padding: '10px', textAlign: 'center' }}>
                        <div className="stat-number" style={{ fontSize: '22px' }}>
                          {mockParticipations.filter(p => p.eventId === event.id).length}
                        </div>
                        <div className="stat-label">Inscritos</div>
                      </div>
                      <div className="stat-card" style={{ padding: '10px', textAlign: 'center' }}>
                        <div className="stat-number" style={{ fontSize: '22px' }}>
                          {new Set(mockParticipations.filter(p => p.eventId === event.id).map(p => p.playerId)).size}
                        </div>
                        <div className="stat-label">Academias</div>
                      </div>
                      <div className="stat-card" style={{ padding: '10px', textAlign: 'center' }}>
                        <div className="stat-number" style={{ fontSize: '22px', color: 'var(--success)' }}>
                          {mockParticipations.filter(p => p.eventId === event.id && p.position === 1).length}
                        </div>
                        <div className="stat-label">Campeones</div>
                      </div>
                      <div className="stat-card" style={{ padding: '10px', textAlign: 'center' }}>
                        <div className="stat-number" style={{ fontSize: '22px', color: 'var(--warning)' }}>
                          {mockParticipations.filter(p => p.eventId === event.id && p.victories > 0).length}
                        </div>
                        <div className="stat-label">Compitieron</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Segunda fila: Ranking de Academias y Top 4 Ranking Liga Nacional */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        marginBottom: '24px'
      }}>
        
        {/* Ranking de Academias */}
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ 
            padding: '16px 20px', 
            borderBottom: '2px solid rgba(255, 255, 255, 0.15)',
            background: 'rgba(0, 0, 0, 0.3)'
          }}>
            <h2 style={{ 
              margin: 0, 
              fontSize: '16px', 
              fontWeight: 600,
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>🏆</span> Ranking de Academias
            </h2>
          </div>
          
          <div style={{ padding: '16px 20px' }}>
            {teamsRanking.length === 0 ? (
              <p className="text-secondary" style={{ textAlign: 'center', padding: '20px', fontWeight: 500 }}>
                No hay datos de academias
              </p>
            ) : (
              <div style={{ display: 'grid', gap: '12px' }}>
                {teamsRanking.map((team, index) => (
                  <div key={team.id} className="card-list-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{
                        width: '32px',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        color: index === 0 ? 'var(--primary)' : index === 1 ? 'var(--text-secondary)' : index === 2 ? 'var(--warning)' : 'var(--text-muted)'
                      }}>
                        {index + 1}
                      </span>
                      <div>
                        <div style={{ fontWeight: 600, color: '#ffffff' }}>
                          {team.name}
                        </div>
                        <div className="text-secondary" style={{ fontSize: '11px', fontWeight: 500 }}>
                          {team.city || 'Ciudad no especificada'}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 'bold', fontSize: '20px', color: 'var(--primary)' }}>
                      {team.totalPoints} pts
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Top 4 Ranking Liga Nacional */}
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ 
            padding: '16px 20px', 
            borderBottom: '2px solid rgba(255, 255, 255, 0.15)',
            background: 'rgba(0, 0, 0, 0.3)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <h2 style={{ 
              margin: 0, 
              fontSize: '16px', 
              fontWeight: 600,
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>🏅</span> Top 4 Ranking Liga Nacional
            </h2>
            
            {/* Selector de categoría compacto */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <select
                value={selectedCategory.gender}
                onChange={(e) => setSelectedCategory({ 
                  gender: e.target.value, 
                  ageGroup: 'Cadetes', 
                  weight: TKD_WEIGHT_CATEGORIES[e.target.value]?.Cadetes?.[0] || '' 
                })}
                style={{
                  padding: '6px 10px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 'var(--radius-md)',
                  color: '#ffffff',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                <option value="Varones">Varones</option>
                <option value="Damas">Damas</option>
              </select>

              <select
                value={selectedCategory.ageGroup}
                onChange={(e) => setSelectedCategory({ 
                  ...selectedCategory, 
                  ageGroup: e.target.value,
                  weight: TKD_WEIGHT_CATEGORIES[selectedCategory.gender]?.[e.target.value]?.[0] || ''
                })}
                style={{
                  padding: '6px 10px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 'var(--radius-md)',
                  color: '#ffffff',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                <option value="Cadetes">Cadetes</option>
                <option value="Juveniles">Juveniles</option>
                <option value="Adultos">Adultos</option>
              </select>

              <select
                value={selectedCategory.weight}
                onChange={(e) => setSelectedCategory({ ...selectedCategory, weight: e.target.value })}
                style={{
                  padding: '6px 10px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 'var(--radius-md)',
                  color: '#ffffff',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                {weightOptions.map(w => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div style={{ padding: '16px 20px' }}>
            {topRanking.length === 0 ? (
              <p className="text-secondary" style={{ textAlign: 'center', padding: '20px', fontWeight: 500 }}>
                No hay deportistas en esta categoría
              </p>
            ) : (
              topRanking.map((player, index) => {
                const copaStatus = getCopaChileStatus(index + 1, player.roundsPlayed)
                return (
                  <div key={player.id} className="card-list-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{
                        width: '32px',
                        fontWeight: 'bold',
                        fontSize: '20px',
                        color: index === 0 ? 'var(--primary)' : index === 1 ? 'var(--text-secondary)' : index === 2 ? 'var(--warning)' : 'var(--text-muted)'
                      }}>
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                      </span>
                      <div>
                        <div style={{ fontWeight: 600, color: '#ffffff' }}>
                          {player.name}
                        </div>
                        <div className="text-secondary" style={{ fontSize: '11px', fontWeight: 500 }}>
                          {player.teamName}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '20px', color: 'var(--primary)' }}>
                        {player.points} pts
                      </div>
                      <Badge color={copaStatus.color} style={{ fontSize: '10px', fontWeight: 500 }}>
                        {copaStatus.label}
                      </Badge>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </Card>
      </div>

      {/* Stats rápidas - Fila inferior */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px'
      }}>
        <Card style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '32px' }}>🥋</div>
          <div className="stat-number" style={{ marginTop: '8px' }}>
            {stats.totalPlayers}
          </div>
          <div className="stat-label">Deportistas</div>
        </Card>

        <Card style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '32px' }}>🏫</div>
          <div className="stat-number" style={{ marginTop: '8px', color: 'var(--success)' }}>
            {stats.totalTeams}
          </div>
          <div className="stat-label">Academias</div>
        </Card>

        <Card style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '32px' }}>📅</div>
          <div className="stat-number" style={{ marginTop: '8px', color: 'var(--warning)' }}>
            {stats.leagueRoundsCompleted}/{TOTAL_LEAGUE_ROUNDS}
          </div>
          <div className="stat-label">Fechas Liga</div>
        </Card>

        <Card style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '32px' }}>🏆</div>
          <div className="stat-number" style={{ marginTop: '8px', color: 'var(--league)' }}>
            {stats.totalParticipations}
          </div>
          <div className="stat-label">Participaciones</div>
        </Card>
      </div>
    </div>
  )
}