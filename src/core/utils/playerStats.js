import { TKD_POINTS, TOTAL_LEAGUE_ROUNDS, MIN_LEAGUE_ROUNDS_FOR_COPA } from '../config/sports/taekwondo'

// Puntuación para torneos (general)
export const TOURNAMENT_POINTS = {
  weighIn: 1,
  victory: 1,
  thirdPlace: 1,
  secondPlace: 3,
  firstPlace: 7
}

// Calcular puntos de una participación (según si es liga o no)
export function calculateRoundPoints(participation, isLeagueEvent = true) {
  const points = isLeagueEvent ? TKD_POINTS : TOURNAMENT_POINTS
  
  let total = 0
  if (participation?.weighIn) total += points.weighIn
  total += (participation?.victories || 0) * points.victory
  
  if (participation?.position === 1) total += points.firstPlace
  else if (participation?.position === 2) total += points.secondPlace
  else if (participation?.position === 3) total += points.thirdPlace
  
  return total
}

// Calcular estadísticas completas de un deportista (separando liga y general)
export function calculatePlayerStats(playerId, events, participations) {
  // Separar eventos de liga y torneos externos
  const leagueEvents = events
    .filter(e => e.isLeagueEvent && e.status === 'Finalizado')
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  const tournamentEvents = events
    .filter(e => !e.isLeagueEvent && e.status === 'Finalizado')
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  // Estadísticas de liga
  let leaguePoints = 0
  let leagueRoundsPlayed = 0
  let leagueVictories = 0
  let leagueGold = 0
  let leagueSilver = 0
  let leagueBronze = 0
  const leagueTimeline = []

  leagueEvents.forEach((event, index) => {
    const participation = participations.find(
      p => p.eventId === event.id && p.playerId === playerId
    )

    if (!participation || participation.status === 'No se presentó' || participation.status === 'Descalificado') {
      leagueTimeline.push({
        round: index + 1,
        eventName: event.name,
        date: event.date,
        points: 0,
        accumulated: leaguePoints,
        participated: false,
        status: participation?.status
      })
      return
    }

    leagueRoundsPlayed++
    leagueVictories += participation.victories || 0
    
    if (participation.position === 1) leagueGold++
    else if (participation.position === 2) leagueSilver++
    else if (participation.position === 3) leagueBronze++

    const roundPoints = calculateRoundPoints(participation, true)
    leaguePoints += roundPoints

    leagueTimeline.push({
      round: index + 1,
      eventName: event.name,
      date: event.date,
      points: roundPoints,
      accumulated: leaguePoints,
      participated: true,
      weighIn: participation.weighIn,
      victories: participation.victories,
      position: participation.position
    })
  })

  // Estadísticas generales (todos los torneos)
  let totalPoints = leaguePoints
  let totalEvents = leagueRoundsPlayed
  let totalVictories = leagueVictories
  let totalGold = leagueGold
  let totalSilver = leagueSilver
  let totalBronze = leagueBronze
  const allTimeline = [...leagueTimeline]

  tournamentEvents.forEach(event => {
    const participation = participations.find(
      p => p.eventId === event.id && p.playerId === playerId
    )

    if (!participation || participation.status === 'No se presentó' || participation.status === 'Descalificado') {
      return
    }

    totalEvents++
    totalVictories += participation.victories || 0
    
    if (participation.position === 1) totalGold++
    else if (participation.position === 2) totalSilver++
    else if (participation.position === 3) totalBronze++

    const roundPoints = calculateRoundPoints(participation, false)
    totalPoints += roundPoints

    allTimeline.push({
      eventName: event.name,
      date: event.date,
      points: roundPoints,
      accumulated: totalPoints,
      participated: true,
      weighIn: participation.weighIn,
      victories: participation.victories,
      position: participation.position,
      isTournament: true
    })
  })

  // Ordenar línea de tiempo por fecha
  allTimeline.sort((a, b) => new Date(a.date) - new Date(b.date))

  return {
    // Estadísticas de liga
    leaguePoints,
    leagueRoundsPlayed,
    leagueVictories,
    leagueGold,
    leagueSilver,
    leagueBronze,
    leagueTimeline,
    
    // Estadísticas generales
    totalPoints,
    totalEvents,
    totalVictories,
    totalGold,
    totalSilver,
    totalBronze,
    allTimeline,
    
    // Totales
    victoryPercentage: totalEvents > 0 ? Math.round((totalVictories / totalEvents) * 100) : 0
  }
}

// Calcular ranking de liga por categoría
export function calculateLeagueRanking(players, events, participations, filters) {
  const { gender, ageGroup, weightCategory } = filters
  
  const filteredPlayers = players.filter(p => 
    (!gender || p.gender === gender) &&
    (!ageGroup || p.ageGroup === ageGroup) &&
    (!weightCategory || p.weightCategory === weightCategory)
  )

  const rankings = filteredPlayers.map(player => {
    const stats = calculatePlayerStats(player.id, events, participations)
    
    return {
      player,
      points: stats.leaguePoints,
      roundsPlayed: stats.leagueRoundsPlayed,
      victories: stats.leagueVictories,
      gold: stats.leagueGold,
      silver: stats.leagueSilver,
      bronze: stats.leagueBronze
    }
  })

  return rankings.sort((a, b) => b.points - a.points)
}

// Calcular ranking general por categoría (todos los torneos)
export function calculateGeneralRanking(players, events, participations, filters) {
  const { gender, ageGroup, weightCategory } = filters
  
  const filteredPlayers = players.filter(p => 
    (!gender || p.gender === gender) &&
    (!ageGroup || p.ageGroup === ageGroup) &&
    (!weightCategory || p.weightCategory === weightCategory)
  )

  const rankings = filteredPlayers.map(player => {
    const stats = calculatePlayerStats(player.id, events, participations)
    
    return {
      player,
      points: stats.totalPoints,
      events: stats.totalEvents,
      victories: stats.totalVictories,
      gold: stats.totalGold,
      silver: stats.totalSilver,
      bronze: stats.totalBronze
    }
  })

  return rankings.sort((a, b) => b.points - a.points)
}

// Determinar estado de clasificación a Copa Chile
export function getCopaChileStatus(position, roundsPlayed) {
  const isTop4 = position <= 4
  const meetsRounds = roundsPlayed >= MIN_LEAGUE_ROUNDS_FOR_COPA

  if (isTop4 && meetsRounds) {
    return {
      label: 'CLASIFICADO',
      color: '#27ae60',
      icon: '✅',
      detail: 'Cumple ambos requisitos: top 4 y mínimo 3 fechas.'
    }
  }

  if (isTop4 && !meetsRounds) {
    const faltan = MIN_LEAGUE_ROUNDS_FOR_COPA - roundsPlayed
    return {
      label: 'ZONA — PENDIENTE',
      color: '#f39c12',
      icon: '⏳',
      detail: `Está en el top 4 pero le falta(n) ${faltan} fecha(s) de liga.`
    }
  }

  return {
    label: 'FUERA DE ZONA',
    color: '#e74c3c',
    icon: '❌',
    detail: 'Sin posibilidades de clasificar.'
  }
}