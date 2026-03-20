// Utilidades mejoradas para TEK-SPORT

export function parseTekSportJSON(jsonText, options = {}) {
  const {
    defaultGender = 'Varones',
    defaultAgeGroup = 'Adultos',
    divisionCode = ''
  } = options
  
  const competitors = []
  const errors = []
  
  try {
    // Intentar parsear como JSON
    let data
    try {
      data = JSON.parse(jsonText)
    } catch (e) {
      // Intentar limpiar texto antes de parsear
      const cleaned = jsonText
        .replace(/^\s*[\[\{]\s*/, '') // Quitar espacios iniciales
        .replace(/\s*[\]\}]\s*$/, '') // Quitar espacios finales
      data = JSON.parse(`[${cleaned}]`)
    }
    
    const responses = Array.isArray(data) ? data : [data]
    
    responses.forEach(resp => {
      // Diferentes formatos posibles
      const weights = resp.combatMatWeights || 
                      resp.data?.combatMatWeights || 
                      resp.weights || 
                      []
      
      weights.forEach(cat => {
        const categoryWeight = cat.categoryWeight || cat.name || ''
        
        // Determinar género
        let gender = defaultGender
        if (/damas|femenina|female|women/i.test(categoryWeight)) gender = 'Damas'
        else if (/varones|masculina|male|men/i.test(categoryWeight)) gender = 'Varones'
        
        // Determinar edad
        let ageGroup = defaultAgeGroup
        if (/cadet/i.test(categoryWeight) || /cadet/i.test(divisionCode)) ageGroup = 'Cadetes'
        else if (/junior/i.test(categoryWeight) || /junior/i.test(divisionCode)) ageGroup = 'Juveniles'
        
        const mats = cat.combatMats || cat.mats || []
        
        mats.forEach(athlete => {
          // Buscar nombre en diferentes campos
          const name = athlete.userName || 
                       athlete.name || 
                       athlete.fullName || 
                       athlete.nombre ||
                       ''
          
          // Buscar academia
          const academy = athlete.academyName || 
                          athlete.clubName || 
                          athlete.teamName || 
                          athlete.academy ||
                          athlete.club ||
                          ''
          
          if (name && name.length > 2) {
            competitors.push({
              name: name.replace(/^[#\d]+\s*/, '').trim(),
              academy: academy.trim(),
              weightKg: null,
              gender,
              ageGroup,
              isDan: /dan/i.test(categoryWeight),
              raw: { categoryWeight } // Guardar referencia
            })
          }
        })
      })
    })
    
    // Eliminar duplicados
    const seen = new Map()
    const unique = competitors.filter(c => {
      const key = `${c.name}|${c.academy}`.toLowerCase()
      if (seen.has(key)) return false
      seen.set(key, true)
      return true
    })
    
    return {
      success: true,
      competitors: unique,
      errors,
      count: unique.length
    }
    
  } catch (error) {
    return {
      success: false,
      competitors: [],
      errors: [error.message],
      count: 0
    }
  }
}

// Función para extraer JSON de texto con múltiples objetos
export function extractJSONFromText(text) {
  const jsonObjects = []
  let start = 0
  
  while (true) {
    const openBrace = text.indexOf('{', start)
    const openBracket = text.indexOf('[', start)
    
    let startPos = -1
    let endPos = -1
    let bracketCount = 0
    
    if (openBrace === -1 && openBracket === -1) break
    
    if (openBrace !== -1 && (openBracket === -1 || openBrace < openBracket)) {
      startPos = openBrace
      let inString = false
      let escape = false
      
      for (let i = startPos; i < text.length; i++) {
        const char = text[i]
        
        if (!inString) {
          if (char === '{') bracketCount++
          else if (char === '}') bracketCount--
          else if (char === '"') inString = true
        } else {
          if (char === '\\') escape = !escape
          else if (char === '"' && !escape) inString = false
          else escape = false
        }
        
        if (bracketCount === 0 && i > startPos) {
          endPos = i + 1
          break
        }
      }
    } else if (openBracket !== -1) {
      startPos = openBracket
      let inString = false
      let escape = false
      
      for (let i = startPos; i < text.length; i++) {
        const char = text[i]
        
        if (!inString) {
          if (char === '[') bracketCount++
          else if (char === ']') bracketCount--
          else if (char === '"') inString = true
        } else {
          if (char === '\\') escape = !escape
          else if (char === '"' && !escape) inString = false
          else escape = false
        }
        
        if (bracketCount === 0 && i > startPos) {
          endPos = i + 1
          break
        }
      }
    }
    
    if (startPos !== -1 && endPos !== -1) {
      try {
        const jsonStr = text.substring(startPos, endPos)
        JSON.parse(jsonStr) // Validar
        jsonObjects.push(jsonStr)
        start = endPos
      } catch {
        start = startPos + 1
      }
    } else {
      break
    }
  }
  
  return jsonObjects
}