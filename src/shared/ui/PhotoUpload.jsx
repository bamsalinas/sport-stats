import React, { useRef, useState } from 'react'

const PHOTO_TIPS = [
  "📐 Encuadre: rostro centrado, desde los hombros hacia arriba",
  "💡 Luz: natural o frontal, sin sombras fuertes en la cara",
  "📏 Tamaño: máximo 2 MB — se recomienda 400×400 px o más",
  "🎨 Fondo: liso o neutro (blanco, gris, azul suave)",
  "👗 Vestimenta: dobok, buzo del club o ropa deportiva",
  "❌ Evitar: filtros, lentes de sol, gorros, fotos grupales",
]

export function PhotoUpload({ photo, onPhoto, label = "Foto de Perfil" }) {
  const ref = useRef()
  const [showTips, setShowTips] = useState(false)

  const handleFile = e => {
    const file = e.target.files[0]
    if (!file) return
    
    if (file.size > 2 * 1024 * 1024) {
      alert("La foto no debe superar 2 MB. Por favor reduce el tamaño.")
      return
    }
    
    const reader = new FileReader()
    reader.onload = ev => onPhoto(ev.target.result)
    reader.readAsDataURL(file)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <label style={{
        fontSize: 11,
        color: 'var(--text-secondary)',
        letterSpacing: 1,
        textTransform: 'uppercase',
        fontWeight: 600
      }}>
        {label}
      </label>

      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div
          onClick={() => ref.current?.click()}
          style={{
            width: 90,
            height: 90,
            borderRadius: 10,
            border: '2px dashed var(--border)',
            background: 'var(--bg-card)',
            cursor: 'pointer',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'border-color 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-blue)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          {photo ? (
            <img 
              src={photo} 
              alt="perfil" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          ) : (
            <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-secondary)', padding: 8 }}>
              <div style={{ fontSize: 28, marginBottom: 4 }}>📷</div>
              Subir foto
            </div>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
            <button
              onClick={() => ref.current?.click()}
              style={{
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: 6,
                color: 'var(--text-secondary)',
                padding: '5px 11px',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}
            >
              📷 Elegir foto
            </button>
            {photo && (
              <button
                onClick={() => onPhoto(null)}
                style={{
                  background: 'transparent',
                  border: '1px solid #c0392b55',
                  borderRadius: 6,
                  color: '#e74c3c',
                  padding: '5px 11px',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >
                Quitar
              </button>
            )}
            <button
              onClick={() => setShowTips(!showTips)}
              style={{
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: 6,
                color: 'var(--text-secondary)',
                padding: '5px 11px',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}
            >
              {showTips ? '▲' : '▼'} Recomendaciones
            </button>
          </div>

          {showTips && (
            <div style={{
              background: '#070f1d',
              borderRadius: 8,
              padding: 12,
              border: '1px solid var(--border)',
              fontSize: 12
            }}>
              {PHOTO_TIPS.map((tip, i) => (
                <div key={i} style={{ color: 'var(--text-secondary)', marginBottom: 4, lineHeight: 1.5 }}>
                  {tip}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <input
        ref={ref}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: 'none' }}
        onChange={handleFile}
      />
    </div>
  )
}