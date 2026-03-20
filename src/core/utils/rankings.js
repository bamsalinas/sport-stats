import { TKD_POINTS, MIN_LEAGUE_ROUNDS_FOR_COPA } from '../config/sports/taekwondo'

// Calcular puntos de un deportista en una fecha
export function calculateRoundPoints(participation) {
  let points = 0
  
  // Pesaje
  if (participation.weighIn) points += TKD_POINTS.weighIn
  
  // Victorias
  points += (participation.victories || 0) * TKD_POINTS.victory
  
  // Posición
  if (participation.position === 1) points += TKD_POINTS.firstPlace
  else if (participation.position === 2) points += TKD_POINTS.secondPlace
  else if (participation.position === 3) points += TKD_POINTS.thirdPlace
  
  return points
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

  // Si está fuera del top 4 pero dentro de posiciones con posibilidad
  if (position <= 8) {
    return {
      label: 'CON POSIBILIDADES',
      color: '#e67e22',
      icon: '🔥',
      detail: 'Puede clasificar en fechas restantes.'
    }
  }

  return {
    label: 'FUERA DE ZONA',
    color: '#e74c3c',
    icon: '❌',
    detail: 'Sin posibilidades de clasificar.'
  }
}