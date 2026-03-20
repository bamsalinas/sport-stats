export const mockPlayers = [
  // Cadetes Varones -45kg
  {
    id: '1',
    name: 'Pedro González',
    gender: 'Varones',
    ageGroup: 'Cadetes',
    weightCategory: '-45kg',
    teamId: 'team1',
    photo: null,
    status: 'Activo',
    dan: '1° Dan'
  },
  {
    id: '2',
    name: 'Martín Soto',
    gender: 'Varones',
    ageGroup: 'Cadetes',
    weightCategory: '-45kg',
    teamId: 'team1',
    photo: null,
    status: 'Activo',
    dan: '1° Dan'
  },
  {
    id: '3',
    name: 'Felipe López',
    gender: 'Varones',
    ageGroup: 'Cadetes',
    weightCategory: '-45kg',
    teamId: 'team2',
    photo: null,
    status: 'Activo',
    dan: '2° Dan'
  },
  {
    id: '4',
    name: 'Andrés Rojas',
    gender: 'Varones',
    ageGroup: 'Cadetes',
    weightCategory: '-45kg',
    teamId: 'team3',
    photo: null,
    status: 'Activo',
    dan: '1° Dan'
  },
  // Cadetes Varones -49kg
  {
    id: '6',
    name: 'Tomás Muñoz',
    gender: 'Varones',
    ageGroup: 'Cadetes',
    weightCategory: '-49kg',
    teamId: 'team2',
    photo: null,
    status: 'Activo',
    dan: '1° Dan'
  },
  {
    id: '7',
    name: 'Diego Paredes',
    gender: 'Varones',
    ageGroup: 'Cadetes',
    weightCategory: '-49kg',
    teamId: 'team1',
    photo: null,
    status: 'Activo',
    dan: '1° Dan'
  },
  // Cadetes Damas -41kg
  {
    id: '5',
    name: 'Camila Rojas',
    gender: 'Damas',
    ageGroup: 'Cadetes',
    weightCategory: '-41kg',
    teamId: 'team2',
    photo: null,
    status: 'Activo',
    dan: '1° Dan'
  },
  {
    id: '8',
    name: 'Valentina Díaz',
    gender: 'Damas',
    ageGroup: 'Cadetes',
    weightCategory: '-41kg',
    teamId: 'team3',
    photo: null,
    status: 'Activo',
    dan: '1° Dan'
  },
  {
    id: '9',
    name: 'Sofía Muñoz',
    gender: 'Damas',
    ageGroup: 'Cadetes',
    weightCategory: '-41kg',
    teamId: 'team1',
    photo: null,
    status: 'Activo',
    dan: '2° Dan'
  },
  // Juveniles Varones -55kg
  {
    id: '10',
    name: 'Benjamín Castro',
    gender: 'Varones',
    ageGroup: 'Juveniles',
    weightCategory: '-55kg',
    teamId: 'team1',
    photo: null,
    status: 'Activo',
    dan: '1° Dan'
  },
  {
    id: '11',
    name: 'Matías Herrera',
    gender: 'Varones',
    ageGroup: 'Juveniles',
    weightCategory: '-55kg',
    teamId: 'team2',
    photo: null,
    status: 'Activo',
    dan: '2° Dan'
  },
  // Adultos Varones -63kg
  {
    id: '12',
    name: 'Carlos Sánchez',
    gender: 'Varones',
    ageGroup: 'Adultos',
    weightCategory: '-63kg',
    teamId: 'team3',
    photo: null,
    status: 'Activo',
    dan: '3° Dan'
  }
]

export const mockTeams = [
  { id: 'team1', name: 'Team León', city: 'Santiago', region: 'Metropolitana' },
  { id: 'team2', name: 'Phoenix', city: 'Concepción', region: 'Biobío' },
  { id: 'team3', name: 'Kim Gan', city: 'Valparaíso', region: 'Valparaíso' }
]

export const mockEvents = [
  { id: 'e1', name: '1° Fecha Liga Nacional', type: 'Liga', date: '2025-03-15', status: 'Finalizado', isLeagueEvent: true, leagueRound: 1 },
  { id: 'e2', name: '2° Fecha Liga Nacional', type: 'Liga', date: '2025-04-12', status: 'Finalizado', isLeagueEvent: true, leagueRound: 2 },
  { id: 'e3', name: '3° Fecha Liga Nacional', type: 'Liga', date: '2025-05-10', status: 'Finalizado', isLeagueEvent: true, leagueRound: 3 },
  { id: 'e4', name: '4° Fecha Liga Nacional', type: 'Liga', date: '2025-06-14', status: 'Próximo', isLeagueEvent: true, leagueRound: 4 },
  { id: 'e5', name: 'Torneo Copa Acero', type: 'Torneo', date: '2025-05-20', status: 'Finalizado', isLeagueEvent: false }
]

export const mockParticipations = [
  // Fecha 1
  { eventId: 'e1', playerId: '1', weighIn: true, victories: 3, position: 1 },
  { eventId: 'e1', playerId: '2', weighIn: true, victories: 2, position: 2 },
  { eventId: 'e1', playerId: '3', weighIn: true, victories: 1, position: 3 },
  { eventId: 'e1', playerId: '4', weighIn: true, victories: 2, position: null },
  { eventId: 'e1', playerId: '5', weighIn: true, victories: 2, position: 1 },
  { eventId: 'e1', playerId: '6', weighIn: true, victories: 1, position: 2 },
  { eventId: 'e1', playerId: '7', weighIn: true, victories: 0, position: null },
  { eventId: 'e1', playerId: '8', weighIn: true, victories: 1, position: 3 },
  { eventId: 'e1', playerId: '9', weighIn: true, victories: 2, position: 2 },
  { eventId: 'e1', playerId: '10', weighIn: true, victories: 2, position: 2 },
  { eventId: 'e1', playerId: '11', weighIn: true, victories: 3, position: 1 },
  { eventId: 'e1', playerId: '12', weighIn: true, victories: 2, position: 1 },
  
  // Fecha 2
  { eventId: 'e2', playerId: '1', weighIn: true, victories: 2, position: 2 },
  { eventId: 'e2', playerId: '2', weighIn: true, victories: 3, position: 1 },
  { eventId: 'e2', playerId: '3', weighIn: true, victories: 1, position: 3 },
  { eventId: 'e2', playerId: '4', weighIn: false, victories: 0, position: null, status: 'No se presentó' },
  { eventId: 'e2', playerId: '5', weighIn: true, victories: 2, position: 2 },
  { eventId: 'e2', playerId: '6', weighIn: true, victories: 1, position: 3 },
  { eventId: 'e2', playerId: '7', weighIn: true, victories: 0, position: null },
  { eventId: 'e2', playerId: '8', weighIn: true, victories: 2, position: 2 },
  { eventId: 'e2', playerId: '9', weighIn: true, victories: 3, position: 1 },
  { eventId: 'e2', playerId: '10', weighIn: true, victories: 2, position: 2 },
  { eventId: 'e2', playerId: '11', weighIn: true, victories: 2, position: 2 },
  { eventId: 'e2', playerId: '12', weighIn: true, victories: 3, position: 1 },
  
  // Fecha 3
  { eventId: 'e3', playerId: '1', weighIn: true, victories: 3, position: 1 },
  { eventId: 'e3', playerId: '2', weighIn: true, victories: 2, position: 2 },
  { eventId: 'e3', playerId: '3', weighIn: true, victories: 1, position: 3 },
  { eventId: 'e3', playerId: '4', weighIn: true, victories: 1, position: null },
  { eventId: 'e3', playerId: '5', weighIn: true, victories: 1, position: 3 },
  { eventId: 'e3', playerId: '6', weighIn: true, victories: 2, position: 2 },
  { eventId: 'e3', playerId: '7', weighIn: true, victories: 1, position: null },
  { eventId: 'e3', playerId: '8', weighIn: true, victories: 2, position: 2 },
  { eventId: 'e3', playerId: '9', weighIn: true, victories: 2, position: 2 },
  { eventId: 'e3', playerId: '10', weighIn: true, victories: 2, position: 2 },
  { eventId: 'e3', playerId: '11', weighIn: true, victories: 3, position: 1 },
  { eventId: 'e3', playerId: '12', weighIn: true, victories: 2, position: 2 }
]