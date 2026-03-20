import React, { useMemo, useState } from 'react'
import { Card, Badge, Button } from '../../../shared/ui'
import { LineChart, BarChart } from '../../../shared/charts/LineChart'
import { mockTeams, mockEvents, mockParticipations, mockPlayers } from '../data/mockData'
import { calculatePlayerStats, getCopaChileStatus } from '../../../core/utils/playerStats'
import { formatDateRange } from '../../../core/utils/dates'
import { PlayerEditForm } from '../components/PlayerEditForm'

export function PlayerProfile({ player, onClose, onEdit }) {
  const [showEditForm, setShowEditForm] = useState(false)

  // Calcular estadísticas del jugador
  const stats = useMemo(() => {
    return calculatePlayerStats(player.id, mockEvents, mockParticipations)
  }, [player])

  // Calcular posiciones en rankings
  const leagueRanking = useMemo(() => {
    const categoryPlayers = mockPlayers.filter(p => 
      p.gender === player.gender &&
      p.ageGroup === player.ageGroup &&
      p.weightCategory === player.weightCategory
    )

    const ranked = categoryPlayers.map(p => {
      const s = calculatePlayerStats(p.id, mockEvents, mockParticipations)
      return { id: p.id, points: s.leaguePoints }
    }).sort((a, b) => b.points - a.points)

    const position = ranked.findIndex(r => r.id === player.id) + 1
    return { position, total: ranked.length }
  }, [player])

  const generalRanking = useMemo(() => {
    const categoryPlayers = mockPlayers.filter(p => 
      p.gender === player.gender &&
      p.ageGroup === player.ageGroup &&
      p.weightCategory === player.weightCategory
    )

    const ranked = categoryPlayers.map(p => {
      const s = calculatePlayerStats(p.id, mockEvents, mockParticipations)
      return { id: p.id, points: s.totalPoints }
    }).sort((a, b) => b.points - a.points)

    const position = ranked.findIndex(r => r.id === player.id) + 1
    return { position, total: ranked.length }
  }, [player])

  // Obtener academia
  const team = mockTeams.find(t => t.id === player.teamId)

  // Estado de Copa Chile
  const leaguePosition = leagueRanking.position
  const copaStatus = getCopaChileStatus(leaguePosition, stats.leagueRoundsPlayed)

  // Preparar datos para gráficos
  const pointsEvolution = stats.leagueTimeline.map(t => ({
    label: `F${t.round}`,
    value: t.accumulated
  }))

  const pointsPerRound = stats.leagueTimeline.filter(t => t.participated).map(t => ({
    label: `F${t.round}`,
    value: t.points
  }))

  const medalsData = [
    { label: '🥇', value: stats.leagueGold },
    { label: '🥈', value: stats.leagueSilver },
    { label: '🥉', value: stats.leagueBronze }
  ].filter(m => m.value > 0)

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
        maxWidth: '800px',
        margin: '0 auto',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '24px'
      }} onClick={e => e.stopPropagation()}>
        
        {/* Header con botón cerrar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ color: 'var(--accent-tkd)', margin: 0 }}>Perfil de Deportista</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '24px', cursor: 'pointer' }}>×</button>
        </div>

        {/* Información básica con foto y rankings */}
        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap' }}>
          {/* Foto */}
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'var(--bg-card)',
            border: '3px solid var(--accent-tkd)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px',
            overflow: 'hidden'
          }}>
            {player.photo ? (
              <img src={player.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              '🥋'
            )}
          </div>

          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '28px', margin: '0 0 8px 0' }}>{player.name}</h1>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
              <Badge color="var(--accent-tkd)">{player.dan}</Badge>
              <Badge color="var(--accent-blue)">{player.gender}</Badge>
              <Badge color="var(--accent-gold)">{player.ageGroup}</Badge>
              <Badge color="var(--text-secondary)">{player.weightCategory}</Badge>
            </div>
            <div style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>
              🏫 {team?.name || 'Sin academia'} · {team?.city || ''} {team?.region || ''}
            </div>
            
            {/* Rankings y clasificación */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ 
                padding: '8px 16px', 
                background: 'var(--bg-card)', 
                borderRadius: '20px',
                border: '1px solid var(--border)'
              }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Ranking Liga: </span>
                <span style={{ fontWeight: 'bold', fontSize: '16px', color: 'var(--accent-tkd)' }}>
                  #{leaguePosition > 0 ? leaguePosition : '—'}
                </span>
              </div>
              
              <div style={{ 
                padding: '8px 16px', 
                background: 'var(--bg-card)', 
                borderRadius: '20px',
                border: '1px solid var(--border)'
              }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Ranking General: </span>
                <span style={{ fontWeight: 'bold', fontSize: '16px', color: 'var(--accent-blue)' }}>
                  #{generalRanking.position > 0 ? generalRanking.position : '—'}
                </span>
              </div>

              <div style={{ 
                padding: '8px 16px', 
                background: `${copaStatus.color}11`, 
                borderRadius: '20px',
                border: `1px solid ${copaStatus.color}`
              }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Copa Chile: </span>
                <span style={{ fontWeight: 'bold', fontSize: '14px', color: copaStatus.color }}>
                  {copaStatus.label}
                </span>
              </div>
            </div>
          </div>

          <Button variant="primary" onClick={() => setShowEditForm(true)}>
            ✏️ Editar perfil
          </Button>
        </div>

        {/* Widget Copa Chile (detalle) */}
        <Card style={{ marginBottom: '24px', background: `${copaStatus.color}11`, borderColor: copaStatus.color }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '32px' }}>{copaStatus.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: copaStatus.color, marginBottom: '4px' }}>
                {copaStatus.label}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                {copaStatus.detail}
              </div>
            </div>
          </div>
        </Card>

        {/* Stats rápidas */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '12px',
          marginBottom: '24px'
        }}>
          <Card style={{ textAlign: 'center', padding: '16px' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--accent-tkd)' }}>
              {stats.leaguePoints}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Puntos Liga</div>
          </Card>
          <Card style={{ textAlign: 'center', padding: '16px' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--accent-blue)' }}>
              {stats.totalPoints}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Puntos Totales</div>
          </Card>
          <Card style={{ textAlign: 'center', padding: '16px' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--accent-green)' }}>
              {stats.leagueVictories}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Victorias Liga</div>
          </Card>
          <Card style={{ textAlign: 'center', padding: '16px' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--accent-gold)' }}>
              {stats.victoryPercentage}%
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>% victorias</div>
          </Card>
        </div>

        {/* Gráficos */}
        <div style={{ display: 'grid', gap: '24px', marginBottom: '24px' }}>
          {pointsEvolution.length >= 2 && (
            <Card>
              <h3 style={{ color: 'var(--accent-tkd)', marginBottom: '16px' }}>Evolución de puntos en Liga</h3>
              <LineChart data={pointsEvolution} color="var(--accent-tkd)" />
            </Card>
          )}

          {pointsPerRound.length > 0 && (
            <Card>
              <h3 style={{ color: 'var(--accent-blue)', marginBottom: '16px' }}>Puntos por fecha de Liga</h3>
              <BarChart data={pointsPerRound} color="var(--accent-blue)" />
            </Card>
          )}

          {medalsData.length > 0 && (
            <Card>
              <h3 style={{ color: 'var(--accent-gold)', marginBottom: '16px' }}>Medallas en Liga</h3>
              <BarChart data={medalsData} color="var(--accent-gold)" />
            </Card>
          )}
        </div>

        {/* Historial de fechas de Liga */}
        <Card>
          <h3 style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>Historial por fecha de Liga</h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            {stats.leagueTimeline.map((t, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '12px',
                background: t.participated ? 'var(--bg-card)' : 'transparent',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                opacity: t.participated ? 1 : 0.5
              }}>
                <div style={{ 
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  background: t.participated ? 'var(--accent-tkd)' : 'var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  color: 'white'
                }}>
                  F{t.round}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{t.eventName}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {formatDateRange(t.date)}
                  </div>
                </div>

                {t.participated ? (
                  <>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 'bold', color: 'var(--accent-green)' }}>
                        +{t.victories} victoria(s)
                      </div>
                      {t.position && (
                        <Badge color={
                          t.position === 1 ? 'var(--accent-gold)' :
                          t.position === 2 ? '#bdc3c7' : '#cd7f32'
                        }>
                          {t.position === 1 ? '🥇 1°' : t.position === 2 ? '🥈 2°' : '🥉 3°'}
                        </Badge>
                      )}
                    </div>
                    <div style={{ 
                      fontSize: '20px', 
                      fontWeight: 'bold', 
                      color: 'var(--accent-tkd)',
                      minWidth: '50px',
                      textAlign: 'right'
                    }}>
                      +{t.points}
                    </div>
                  </>
                ) : (
                  <div style={{ color: 'var(--text-secondary)' }}>
                    No participó
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Historial de torneos externos */}
        {stats.allTimeline.filter(t => t.isTournament).length > 0 && (
          <Card style={{ marginTop: '24px' }}>
            <h3 style={{ color: 'var(--accent-blue)', marginBottom: '16px' }}>Torneos externos</h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              {stats.allTimeline.filter(t => t.isTournament).map((t, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  background: 'var(--bg-card)',
                  borderRadius: '8px',
                  border: '1px solid var(--border)'
                }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{t.eventName}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {formatDateRange(t.date)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    {t.position && (
                      <Badge color={
                        t.position === 1 ? 'var(--accent-gold)' :
                        t.position === 2 ? '#bdc3c7' : '#cd7f32'
                      }>
                        {t.position === 1 ? '🥇' : t.position === 2 ? '🥈' : '🥉'}
                      </Badge>
                    )}
                    <div style={{ fontWeight: 'bold', color: 'var(--accent-blue)' }}>
                      +{t.points} pts
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Botón cerrar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
          <Button variant="ghost" onClick={onClose}>Cerrar</Button>
        </div>
      </div>

      {/* Modal de edición de deportista */}
      {showEditForm && (
        <PlayerEditForm
          player={player}
          teams={mockTeams}
          onSave={(updatedPlayer) => {
            const index = mockPlayers.findIndex(p => p.id === player.id)
            if (index !== -1) {
              mockPlayers[index] = { ...mockPlayers[index], ...updatedPlayer }
            }
            setShowEditForm(false)
            // Cerrar perfil para refrescar
            onClose()
          }}
          onClose={() => setShowEditForm(false)}
        />
      )}
    </div>
  )
}