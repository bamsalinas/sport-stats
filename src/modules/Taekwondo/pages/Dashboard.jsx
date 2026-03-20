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

  // Próximos eventos
  const upcomingEvents = useMemo(() => {
    return mockEvents
      .filter(e => e.status === 'Próximo')
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 4)
  }, [])

  // Ranking de academias (top 5)
  const teamsRanking = useMemo(() => {
    const ranking = calculateTeamsRanking(mockTeams, mockPlayers, mockEvents, mockParticipations)
    return ranking.slice(0, 5)
  }, [])

  // Destacados de la semana (últimos resultados)
  const recentHighlights = useMemo(() => {
    const recentEvents = mockEvents
      .filter(e => e.status === 'Finalizado')
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 2)

    return recentEvents.map(event => {
      const participations = mockParticipations.filter(p => p.eventId === event.id)
      const winners = participations.filter(p => p.position === 1).map(p => {
        const player = mockPlayers.find(pl => pl.id === p.playerId)
        return player
      }).filter(Boolean)

      return {
        event,
        winners: winners.slice(0, 3) // Top 3 ganadores
      }
    })
  }, [])

   // Top 4 de una categoría destacada
  const topRanking = useMemo(() => {
  const { gender, ageGroup, weight } = selectedCategory
  
  const categoryPlayers = mockPlayers.filter(p => 
    p.gender === gender &&
    p.ageGroup === ageGroup &&
    p.weightCategory === weight
  )

  const playersWithStats = categoryPlayers.map(player => {
    const stats = calculatePlayerStats(player.id, mockEvents, mockParticipations)
    return { 
      ...player, 
      points: stats.leaguePoints,
      roundsPlayed: stats.leagueRoundsPlayed 
    }
  })

  return playersWithStats
    .sort((a, b) => b.points - a.points)
    .slice(0, 4)  // ← AHORA SON 4
}, [selectedCategory])

  // Opciones para selector de categoría
  const weightOptions = TKD_WEIGHT_CATEGORIES[selectedCategory.gender]?.[selectedCategory.ageGroup] || []

  return (
    <div style={{ padding: '20px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '28px', color: 'var(--accent-tkd)', margin: '0 0 8px 0' }}>
          🥋 Panel de Control Taekwondo
        </h1>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
          Resumen general de la Liga Nacional y torneos
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <Card>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>🥋</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--accent-tkd)' }}>
            {stats.totalPlayers}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Deportistas</div>
        </Card>

        <Card>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>🏫</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--accent-blue)' }}>
            {stats.totalTeams}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Academias</div>
        </Card>

        <Card>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>📅</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--accent-gold)' }}>
            {stats.leagueRoundsCompleted}/{TOTAL_LEAGUE_ROUNDS}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Fechas Liga</div>
        </Card>

        <Card>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚡</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--accent-green)' }}>
            {stats.upcomingEvents}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Próximos eventos</div>
        </Card>

        <Card>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>🏆</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--accent-orange)' }}>
            {stats.totalParticipations}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Participaciones</div>
        </Card>
      </div>

      {/* Dos columnas: Próximos eventos y Ranking academias */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {/* Próximos eventos */}
        <Card glow glowColor="var(--accent-blue)">
        <h3 style={{ margin: '0 0 16px 0', color: 'var(--accent-blue)' }}>📅 Próximos eventos</h3>
        {upcomingEvents.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>
            No hay eventos próximos
            </p>
        ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
            {upcomingEvents.map(event => {
                const eventDate = new Date(event.date)
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                eventDate.setHours(0, 0, 0, 0)
                
                const isToday = eventDate.getTime() === today.getTime()
                const diffDays = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24))
                
                return (
                <div key={event.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    background: 'var(--bg-card)',
                    borderRadius: '8px',
                    border: '1px solid var(--border)'
                }}>
                    <div>
                    <div style={{ fontWeight: 600 }}>{event.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {formatDateRange(event.date, event.endDate)}
                        {isToday && <span style={{ color: 'var(--accent-green)', marginLeft: '8px' }}>¡Hoy!</span>}
                        {!isToday && diffDays === 1 && <span style={{ color: 'var(--accent-gold)', marginLeft: '8px' }}>Mañana</span>}
                        {!isToday && diffDays > 1 && diffDays <= 7 && 
                        <span style={{ color: 'var(--accent-blue)', marginLeft: '8px' }}>En {diffDays} días</span>
                        }
                        {!isToday && diffDays > 7 && 
                        <span style={{ color: 'var(--text-secondary)', marginLeft: '8px' }}>
                            {new Date(event.date).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })}
                        </span>
                        }
                    </div>
                    </div>
                    <Badge color={event.isLeagueEvent ? 'var(--accent-tkd)' : 'var(--accent-blue)'}>
                    {event.isLeagueEvent ? `Liga F${event.leagueRound}` : 'Torneo'}
                    </Badge>
                </div>
                )
            })}
            </div>
        )}
        </Card>

        {/* Top 5 Academias */}
        <Card glow glowColor="var(--accent-gold)">
          <h3 style={{ margin: '0 0 16px 0', color: 'var(--accent-gold)' }}>🏆 Top 5 Academias</h3>
          {teamsRanking.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>
              No hay datos de academias
            </p>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {teamsRanking.map((team, index) => (
                <div key={team.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  background: 'var(--bg-card)',
                  borderRadius: '8px',
                  border: '1px solid var(--border)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{
                      fontWeight: 'bold',
                      color: index === 0 ? 'var(--accent-gold)' : 
                             index === 1 ? '#bdc3c7' : 
                             index === 2 ? '#cd7f32' : 'var(--text-secondary)'
                    }}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}°`}
                    </span>
                    <div>
                      <div style={{ fontWeight: 600 }}>{team.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        {team.gold} 🥇 {team.silver} 🥈 {team.bronze} 🥉
                      </div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 'bold', color: 'var(--accent-tkd)' }}>
                    {team.totalPoints} pts
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Top 4 Ranking de Liga con clasificación a Copa Chile */}
        <Card glow glowColor="var(--accent-tkd)" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, color: 'var(--accent-tkd)' }}>
            🏆 Top 4 Ranking Liga Nacional - {selectedCategory.gender} {selectedCategory.ageGroup} {selectedCategory.weight}
            </h3>
            
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
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontSize: '13px'
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
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontSize: '13px'
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
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontSize: '13px'
                }}
            >
                {weightOptions.map(w => (
                <option key={w} value={w}>{w}</option>
                ))}
            </select>
            </div>
        </div>

        {/* Top 4 - todos con el mismo estilo y fondo según clasificación */}
        <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px'
        }}>
            {topRanking.map((player, index) => {
            const copaStatus = getCopaChileStatus(index + 1, player.roundsPlayed)
            const team = mockTeams.find(t => t.id === player.teamId)
            
            // Emoji según posición
            const positionEmoji = index === 0 ? '🥇' : 
                                    index === 1 ? '🥈' : 
                                    index === 2 ? '🥉' : 
                                    '🏅'  // Medalla de honor para 4° lugar
            
            return (
                <Card key={player.id} style={{ 
                textAlign: 'center',
                borderColor: copaStatus.color,
                background: `${copaStatus.color}11`,
                position: 'relative',
                overflow: 'hidden'
                }}>
                {/* Efecto de brillo para clasificados */}
                {index < 4 && (
                    <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(90deg, ${copaStatus.color}, #fff, ${copaStatus.color})`,
                    animation: 'shine 2s infinite'
                    }} />
                )}
                
                <div style={{ fontSize: '36px', marginBottom: '8px' }}>
                    {positionEmoji}
                </div>
                
                <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>
                    {player.name}
                </div>
                
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    {team?.name || 'Sin academia'}
                </div>
                
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--accent-tkd)', marginBottom: '8px' }}>
                    {player.points} pts
                </div>
                
                <div style={{ fontSize: '11px', marginBottom: '8px' }}>
                    {player.roundsPlayed}/{TOTAL_LEAGUE_ROUNDS} fechas
                </div>
                
                <Badge color={copaStatus.color} style={{ fontSize: '11px', padding: '4px 12px' }}>
                    {copaStatus.label}
                </Badge>
                </Card>
            )
            })}
        </div>
        </Card>

      {/* Últimos resultados destacados */}
      <Card>
        <h3 style={{ margin: '0 0 16px 0', color: 'var(--accent-green)' }}>✨ Últimos resultados</h3>
        {recentHighlights.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>
            No hay resultados recientes
          </p>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {recentHighlights.map(({ event, winners }) => (
              <div key={event.id}>
                <div style={{ fontWeight: 600, marginBottom: '8px' }}>
                  {event.name} · {formatDateRange(event.date, event.endDate)}
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {winners.map((winner, i) => {
                    const team = mockTeams.find(t => t.id === winner?.teamId)
                    return (
                      <div key={winner?.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        background: 'var(--bg-card)',
                        borderRadius: '20px',
                        border: '1px solid var(--border)'
                      }}>
                        <span>{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>
                        <span style={{ fontWeight: 500 }}>{winner?.name}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                          {team?.name}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}