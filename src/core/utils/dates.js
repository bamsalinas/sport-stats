export function formatDateRange(startDate, endDate) {
  if (!startDate) return 'Sin fecha'

  const start = new Date(startDate + 'T12:00:00')
  const end = endDate ? new Date(endDate + 'T12:00:00') : start

  if (startDate === endDate || !endDate) {
    return start.toLocaleDateString('es-CL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const sameYear = start.getFullYear() === end.getFullYear()
  const sameMonth = sameYear && start.getMonth() === end.getMonth()

  if (sameMonth) {
    return `${start.getDate()}–${end.getDate()} ${start.toLocaleDateString('es-CL', {
      month: 'short',
      year: 'numeric'
    })}`
  }

  if (sameYear) {
    return `${start.toLocaleDateString('es-CL', {
      day: 'numeric',
      month: 'short'
    })} – ${end.toLocaleDateString('es-CL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })}`
  }

  return `${start.toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })} – ${end.toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })}`
}

export function calculateAge(birthDate) {
  if (!birthDate) return null
  const diff = Date.now() - new Date(birthDate).getTime()
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000))
}