// Categorías de peso por género y edad 

export const TKD_WEIGHT_CATEGORIES = {
  Varones: {
    Cadetes: ["-33kg", "-37kg", "-41kg", "-45kg", "-49kg", "-53kg", "-57kg", "-61kg", "-65kg", "+65kg"],
    Juveniles: ["-45kg", "-48kg", "-51kg", "-55kg", "-59kg", "-63kg", "-68kg", "-73kg", "-78kg", "+78kg"],
    Adultos: ["-54kg", "-58kg", "-63kg", "-68kg", "-74kg", "-80kg", "-87kg", "+87kg"]
  },
  Damas: {
    Cadetes: ["-29kg", "-33kg", "-37kg", "-41kg", "-44kg", "-47kg", "-51kg", "-55kg", "-59kg", "+59kg"],
    Juveniles: ["-42kg", "-44kg", "-46kg", "-49kg", "-52kg", "-55kg", "-59kg", "-63kg", "-68kg", "+68kg"],
    Adultos: ["-46kg", "-49kg", "-53kg", "-57kg", "-62kg", "-67kg", "-73kg", "+73kg"]
  }
}

// Puntuación de la liga
export const TKD_POINTS = {
  weighIn: 1,      // Pesaje OK
  victory: 1,      // Combate ganado
  thirdPlace: 3,   // 3er lugar
  secondPlace: 5,  // 2do lugar
  firstPlace: 7    // 1er lugar
}

// Total de fechas de liga
export const TOTAL_LEAGUE_ROUNDS = 5

// Mínimo de fechas para clasificar a Copa Chile
export const MIN_LEAGUE_ROUNDS_FOR_COPA = 3

// Grados Dan/Poom
export const DAN_GRADES = [
  "1° Dan", "2° Dan", "3° Dan", "4° Dan", "5° Dan", 
  "6° Dan", "7° Dan", "8° Dan", "9° Dan",
  "1° Poom", "2° Poom", "3° Poom"
]

// Regiones de Chile
export const REGIONS = [
  "Arica y Parinacota", "Tarapacá", "Antofagasta", "Atacama", "Coquimbo",
  "Valparaíso", "Metropolitana", "O'Higgins", "Maule", "Ñuble",
  "Biobío", "La Araucanía", "Los Ríos", "Los Lagos", "Aysén",
  "Magallanes", "Otra"
]

// Estados de deportista
export const PLAYER_STATUS = ["Activo", "Inactivo", "Suspendido", "Retirado"]