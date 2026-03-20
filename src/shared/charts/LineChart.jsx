import React from 'react'

export function LineChart({ data, color = '#9b59b6', height = 100 }) {
  if (!data || data.length < 2) {
    return (
      <div style={{ color: 'var(--text-secondary)', fontSize: '12px', textAlign: 'center', padding: '20px' }}>
        Mínimo 2 fechas para mostrar gráfico
      </div>
    )
  }

  const width = 300
  const padding = 20
  const chartHeight = height - padding * 2

  // Encontrar valores máximos y mínimos
  const values = data.map(d => d.value)
  const maxValue = Math.max(...values, 1)
  const minValue = Math.min(...values, 0)
  const range = maxValue - minValue || 1

  // Calcular puntos para la línea
  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2)
    const y = height - padding - ((d.value - minValue) / range) * chartHeight
    return { x, y, label: d.label, value: d.value }
  })

  const linePath = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
      {/* Líneas de grid */}
      <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="var(--border)" strokeWidth="1" />
      <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="var(--border)" strokeWidth="1" />
      
      {/* Área bajo la línea */}
      <path
        d={`${linePath} L ${points[points.length - 1].x},${height - padding} L ${points[0].x},${height - padding} Z`}
        fill={`${color}22`}
      />
      
      {/* Línea principal */}
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
      />
      
      {/* Puntos */}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" fill={color} stroke="var(--bg-secondary)" strokeWidth="2" />
          <text x={p.x} y={p.y - 10} textAnchor="middle" fill={color} fontSize="10" fontWeight="bold">
            {p.value}
          </text>
          <text x={p.x} y={height - 5} textAnchor="middle" fill="var(--text-secondary)" fontSize="9">
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  )
}

export function BarChart({ data, color = '#f39c12', height = 100 }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ color: 'var(--text-secondary)', fontSize: '12px', textAlign: 'center', padding: '20px' }}>
        Sin datos
      </div>
    )
  }

  const width = 300
  const padding = 20
  const maxValue = Math.max(...data.map(d => d.value), 1)
  const barWidth = (width - padding * 2) / data.length - 4

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
      {data.map((d, i) => {
        const barHeight = (d.value / maxValue) * (height - padding * 2)
        const x = padding + i * ((width - padding * 2) / data.length) + 2
        const y = height - padding - barHeight

        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill={color}
              rx="4"
              opacity="0.8"
            />
            {d.value > 0 && (
              <text x={x + barWidth / 2} y={y - 5} textAnchor="middle" fill={color} fontSize="10" fontWeight="bold">
                {d.value}
              </text>
            )}
            <text x={x + barWidth / 2} y={height - 5} textAnchor="middle" fill="var(--text-secondary)" fontSize="9">
              {d.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}