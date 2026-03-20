import { calculatePlayerStats } from './playerStats'

// Calcular estadísticas de una academia
export function calculateTeamStats(teamId, players, events, participations) {
  // Obtener jugadores de la academia
  const teamPlayers = players.filter(p => p.teamId === teamId)
  
  if (teamPlayers.length === 0) {
    return {
      totalPlayers: 0,
      totalPoints: 0,
      totalVictories: 0,
      totalRounds: 0,
      gold: 0,
      silver: 0,
      bronze: 0,
      players: []
    }
  }

  // Calcular estadísticas de cada jugador
  const playersStats = teamPlayers.map(player => {
    const stats = calculatePlayerStats(player.id, events, participations)
    return {
      ...player,
      ...stats
    }
  })

  // Sumar totales
  const totals = playersStats.reduce((acc, player) => {
    acc.totalPoints += player.totalPoints
    acc.totalVictories += player.totalVictories
    acc.totalRounds += player.roundsPlayed
    acc.gold += player.gold
    acc.silver += player.silver
    acc.bronze += player.bronze
    return acc
  }, {
    totalPoints: 0,
    totalVictories: 0,
    totalRounds: 0,
    gold: 0,
    silver: 0,
    bronze: 0
  })

  return {
    totalPlayers: teamPlayers.length,
    ...totals,
    players: playersStats.sort((a, b) => b.totalPoints - a.totalPoints),
    averagePoints: teamPlayers.length > 0 
      ? Math.round(totals.totalPoints / teamPlayers.length) 
      : 0
  }
}

// Calcular ranking de academias
export function calculateTeamsRanking(teams, players, events, participations) {
  return teams.map(team => {
    const stats = calculateTeamStats(team.id, players, events, participations)
    return {
      ...team,
      ...stats
    }
  })
  .filter(team => team.totalPlayers > 0)
  .sort((a, b) => b.totalPoints - a.totalPoints)
}