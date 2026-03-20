// Utilidades mejoradas para importar desde TKNET.CL

// Cache para evitar recargar misma URL
const cache = new Map()

export async function fetchWithProxy(url, forceRefresh = false) {
  if (!forceRefresh && cache.has(url)) {
    console.log('Usando cache para:', url)
    return cache.get(url)
  }
  
  console.log('Fetching:', url)
  
  const proxies = [
    `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
    `https://cors-anywhere.herokuapp.com/${url}`,
    `https://thingproxy.freeboard.io/fetch/${url}`
  ]

  for (const proxy of proxies) {
    try {
      const response = await fetch(proxy)
      if (!response.ok) continue
      
      const data = await response.json()
      const html = data.contents || data
      
      if (html && html.length > 100) {
        cache.set(url, html)
        return html
      }
    } catch (error) {
      console.warn(`Proxy failed: ${proxy}`)
    }
  }
  
  throw new Error('No se pudo conectar con tknet.cl')
}

// Extraer todas las categorías visibles
export function extractCategories(doc) {
  const categories = []
  
  // Buscar enlaces a llaves
  const links = doc.querySelectorAll('a[href*="llave-"]')
  links.forEach(link => {
    const href = link.getAttribute('href')
    const match = href?.match(/llave-([^/?\s]+)/)
    if (match) {
      categories.push({
        slug: match[1],
        name: link.textContent?.trim() || match[1],
        isDan: /dan/i.test(match[1]) || /dan/i.test(link.textContent || '')
      })
    }
  })
  
  // Buscar en tablas o listas
  const rows = doc.querySelectorAll('tr, li')
  rows.forEach(row => {
    const text = row.textContent || ''
    if (text.includes('Categoría') || text.includes('Categoria')) {
      const catMatch = text.match(/(?:Categor[íi]a[s]?[:\s]*)([^\n]+)/i)
      if (catMatch) {
        const catName = catMatch[1].trim()
        categories.push({
          slug: catName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          name: catName,
          isDan: /dan/i.test(catName)
        })
      }
    }
  })
  
  return categories
}

// Extraer información básica del torneo
export function parseTournamentInfo(html, url) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  
  const title = doc.querySelector('h1')?.textContent?.trim() || 
                doc.querySelector('title')?.textContent?.trim() || 
                'Torneo sin título'
  
  const organizer = doc.querySelector('strong')?.textContent?.replace('Organiza:', '').trim() ||
                   doc.querySelector('.organizador')?.textContent?.trim() || ''
  
  const text = doc.body?.textContent || ''
  const dateMatch = text.match(/\d{1,2}[-/]\d{1,2}[-/]\d{4}/g)
  const dates = dateMatch ? [...new Set(dateMatch)] : []
  
  const categories = extractCategories(doc)
  
  // Extraer slug de la URL
  const slug = url.replace(/\/$/, '').split('/').pop()
  
  return {
    title,
    organizer,
    dates,
    categories,
    slug
  }
}

// Parsear competidores de una categoría (versión mejorada)
export function parseCategoryCompetitors(html, categoryInfo) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  
  const competitors = []
  const text = doc.body?.textContent || ''
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0)
  
  // Determinar categoría de edad
  let ageGroup = 'Adultos'
  const catName = categoryInfo.name || categoryInfo.slug || ''
  if (/cadet/i.test(catName)) ageGroup = 'Cadetes'
  else if (/juvenil|junior/i.test(catName)) ageGroup = 'Juveniles'
  else if (/infantil/i.test(catName)) ageGroup = 'Cadetes'
  
  // Determinar género
  let gender = 'Varones'
  if (/damas|femenina|female/i.test(catName)) gender = 'Damas'
  
  // Patrones de búsqueda
  const namePatterns = [
    /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+/, // Nombre Apellido
    /^[A-ZÁÉÍÓÚÑ\s]{5,40}$/, // Todo mayúsculas
    /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]{4,40}$/ // Mixto
  ]
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    
    // Buscar nombres
    let isName = false
    for (const pattern of namePatterns) {
      if (pattern.test(line) && 
          !line.includes('Competidor') && 
          !line.includes('FINAL') &&
          line.length < 50) {
        isName = true
        break
      }
    }
    
    if (isName) {
      // Buscar academia (líneas siguientes)
      let academy = ''
      for (let j = i + 1; j < Math.min(i + 4, lines.length); j++) {
        const nextLine = lines[j]
        if (nextLine.match(/^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]{3,40}$/) && 
            !nextLine.match(/^\d+$/) &&
            !nextLine.includes('Kilos')) {
          academy = nextLine
          break
        }
      }
      
      // Buscar peso
      let weight = null
      for (let j = i; j < Math.min(i + 10, lines.length); j++) {
        const weightMatch = lines[j].match(/(\d+(?:\.\d+)?)\s*Kilos/i)
        if (weightMatch) {
          weight = parseFloat(weightMatch[1])
          break
        }
      }
      
      competitors.push({
        name: line,
        academy,
        weight,
        gender,
        ageGroup,
        isDan: categoryInfo.isDan
      })
    }
  }
  
  // Eliminar duplicados
  const seen = new Set()
  return competitors.filter(c => {
    const key = c.name.toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}