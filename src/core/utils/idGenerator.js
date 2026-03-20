// Generador simple de IDs únicos
export function generateId() {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36)
}

// Alternativa: ID más legible (ej: TKD-001)
export function generateCustomId(prefix = 'TKD') {
  const num = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `${prefix}-${num}`
}