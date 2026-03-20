import React, { useState, useEffect } from 'react'
import { Card, Button, Badge, Input, Select } from '../../../shared/ui'
import { TKD_WEIGHT_CATEGORIES } from '../../../core/config/sports/taekwondo'
import { mockPlayers, mockTeams, mockEvents, mockParticipations } from '../data/mockData'

export function ImportHub({ onImport, onClose }) {
  const [source, setSource] = useState(null)
  const [url, setUrl] = useState('')
  const [jsonText, setJsonText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [tournament, setTournament] = useState(null)
  const [competitors, setCompetitors] = useState([])
  const [filterDan, setFilterDan] = useState(true)
  const [divisionCode, setDivisionCode] = useState('CADETS')
  const [progress, setProgress] = useState({ done: 0, total: 0 })
  const [importLog, setImportLog] = useState([])
  const [step, setStep] = useState('idle')
  const [importOptions, setImportOptions] = useState({
    createEvent: true,
    createTeams: true,
    createPlayers: true
  })
  const [eventInfo, setEventInfo] = useState({
    name: '',
    type: 'Torneo',
    date: new Date().toISOString().split('T')[0],
    endDate: '',
    location: ''
  })
  const [importMode, setImportMode] = useState('auto')
  const [manualHtml, setManualHtml] = useState('')

  // ==================== FUNCIÓN DE NORMALIZACIÓN ====================
  const normalizeName = (name) => {
    if (!name) return ''
    
    let normalized = name.toLowerCase().trim()
    
    normalized = normalized.replace(/[áàäâã]/g, 'a')
                           .replace(/[éèëê]/g, 'e')
                           .replace(/[íìïî]/g, 'i')
                           .replace(/[óòöôõ]/g, 'o')
                           .replace(/[úùüû]/g, 'u')
                           .replace(/ñ/g, 'n')
                           .replace(/ç/g, 'c')
    
    normalized = normalized.replace(/[^a-z0-9\s]/g, '')
                           .replace(/\s+/g, ' ')
                           .trim()
    
    return normalized
  }

  const formatName = (name) => {
    if (!name) return ''
    return name.toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const normalizeAcademy = (academy) => {
    if (!academy) return ''
    
    let normalized = academy.toLowerCase().trim()
    
    normalized = normalized.replace(/[áàäâã]/g, 'a')
                           .replace(/[éèëê]/g, 'e')
                           .replace(/[íìïî]/g, 'i')
                           .replace(/[óòöôõ]/g, 'o')
                           .replace(/[úùüû]/g, 'u')
                           .replace(/ñ/g, 'n')
                           .replace(/ç/g, 'c')
    
    normalized = normalized.replace(/[^a-z0-9\s]/g, '')
                           .replace(/\s+/g, ' ')
                           .trim()
    
    return normalized
  }

  // ==================== MAPEO DE CATEGORÍAS DE PESO ====================
    const getWeightCategory = (gender, ageGroup, weightMin, weightMax) => {
    // Si no tenemos rango, devolvemos null
    if (!weightMax && !weightMin) return null
    
    const maxWeight = weightMax || weightMin || 0
    
    // CADETES
    if (ageGroup === 'Cadetes') {
        if (gender === 'Varones') {
        if (maxWeight <= 32.9) return '-33kg'
        if (maxWeight <= 36.9) return '-37kg'
        if (maxWeight <= 40.9) return '-41kg'
        if (maxWeight <= 44.9) return '-45kg'
        if (maxWeight <= 48.9) return '-49kg'
        if (maxWeight <= 52.9) return '-53kg'
        if (maxWeight <= 56.9) return '-57kg'
        if (maxWeight <= 60.9) return '-61kg'
        if (maxWeight <= 64.9) return '-65kg'
        return '+65kg'
        } else { // Damas
        if (maxWeight <= 28.9) return '-29kg'
        if (maxWeight <= 32.9) return '-33kg'
        if (maxWeight <= 36.9) return '-37kg'
        if (maxWeight <= 40.9) return '-41kg'
        if (maxWeight <= 43.9) return '-44kg'
        if (maxWeight <= 46.9) return '-47kg'
        if (maxWeight <= 50.9) return '-51kg'
        if (maxWeight <= 54.9) return '-55kg'
        if (maxWeight <= 58.9) return '-59kg'
        return '+59kg'
        }
    }
    
    // JUVENILES
    if (ageGroup === 'Juveniles') {
        if (gender === 'Varones') {
        if (maxWeight <= 44.9) return '-45kg'
        if (maxWeight <= 47.9) return '-48kg'
        if (maxWeight <= 50.9) return '-51kg'
        if (maxWeight <= 54.9) return '-55kg'
        if (maxWeight <= 58.9) return '-59kg'
        if (maxWeight <= 62.9) return '-63kg'
        if (maxWeight <= 67.9) return '-68kg'
        if (maxWeight <= 72.9) return '-73kg'
        if (maxWeight <= 77.9) return '-78kg'
        return '+78kg'
        } else { // Damas
        if (maxWeight <= 41.9) return '-42kg'
        if (maxWeight <= 43.9) return '-44kg'
        if (maxWeight <= 45.9) return '-46kg'
        if (maxWeight <= 48.9) return '-49kg'
        if (maxWeight <= 51.9) return '-52kg'
        if (maxWeight <= 54.9) return '-55kg'
        if (maxWeight <= 58.9) return '-59kg'
        if (maxWeight <= 62.9) return '-63kg'
        if (maxWeight <= 67.9) return '-68kg'
        return '+68kg'
        }
    }
    
    // ADULTOS
    if (gender === 'Varones') {
        if (maxWeight <= 53.9) return '-54kg'
        if (maxWeight <= 57.9) return '-58kg'
        if (maxWeight <= 62.9) return '-63kg'
        if (maxWeight <= 67.9) return '-68kg'
        if (maxWeight <= 73.9) return '-74kg'
        if (maxWeight <= 79.9) return '-80kg'
        if (maxWeight <= 86.9) return '-87kg'
        return '+87kg'
    } else { // Damas Adultos
        if (maxWeight <= 45.9) return '-46kg'
        if (maxWeight <= 48.9) return '-49kg'
        if (maxWeight <= 52.9) return '-53kg'
        if (maxWeight <= 56.9) return '-57kg'
        if (maxWeight <= 61.9) return '-62kg'
        if (maxWeight <= 66.9) return '-67kg'
        if (maxWeight <= 72.9) return '-73kg'
        return '+73kg'
    }
    }

  const formatAcademy = (academy) => {
    if (!academy) return ''
    return academy.toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  useEffect(() => {
    if (tournament) {
      setEventInfo(prev => ({
        ...prev,
        name: tournament.title || 'Torneo sin nombre'
      }))
    }
  }, [tournament])

  const reset = () => {
    setSource(null)
    setUrl('')
    setJsonText('')
    setError('')
    setTournament(null)
    setCompetitors([])
    setImportLog([])
    setStep('idle')
    setEventInfo({
      name: '',
      type: 'Torneo',
      date: new Date().toISOString().split('T')[0],
      endDate: '',
      location: ''
    })
  }

  // ==================== FUNCIONES TKNET ====================
  const fetchWithProxy = async (url) => {
    console.log('fetchWithProxy llamado', url)
    
    const proxies = [
      `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
      `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
      `https://corsproxy.io/?${encodeURIComponent(url)}`
    ]

    for (const proxy of proxies) {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)
      
      try {
        const response = await fetch(proxy, { signal: controller.signal })
        clearTimeout(timeoutId)
        
        if (!response.ok) continue
        
        const data = await response.json()
        const html = data.contents || data
        
        if (html && html.length > 500) {
          return html
        }
      } catch (error) {
        clearTimeout(timeoutId)
        console.warn(`Proxy failed: ${proxy}`, error.message)
      }
    }
    
    throw new Error('No se pudo conectar con tknet.cl')
  }

  const parseTournamentInfo = (html, url) => {
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
    
    const slug = url.replace(/\/$/, '').split('/').pop()
    
    return { title, organizer, dates, slug }
  }

  // Parsear competidores de una categoría desde HTML
  const parseCategoryCompetitors = (html, categoryInfo) => {
    if (!categoryInfo?.name && !categoryInfo?.slug) {
      console.warn('Categoría sin información, saltando')
      return []
    }
    
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    
    const competitorsList = []
    const seenNames = new Set()
    
    const titleElement = doc.querySelector('.tit-competi')
    let categoryGender = 'Varones'
    let categoryWeightCode = null
    
    if (titleElement) {
      const titleText = titleElement.textContent || ''
      if (titleText.includes('Damas') || titleText.includes('Femenina')) {
        categoryGender = 'Damas'
      }
      
      const weightRangeMatch = titleText.match(/(\d+\.?\d*)\s*a\s*(\d+\.?\d*)/)
      if (weightRangeMatch) {
        const weightMax = parseFloat(weightRangeMatch[2])
        if (weightMax <= 32.9) categoryWeightCode = '-33kg'
        else if (weightMax <= 36.9) categoryWeightCode = '-37kg'
        else if (weightMax <= 40.9) categoryWeightCode = '-41kg'
        else if (weightMax <= 44.9) categoryWeightCode = '-45kg'
        else if (weightMax <= 48.9) categoryWeightCode = '-49kg'
        else if (weightMax <= 52.9) categoryWeightCode = '-53kg'
        else if (weightMax <= 56.9) categoryWeightCode = '-57kg'
        else if (weightMax <= 60.9) categoryWeightCode = '-61kg'
        else if (weightMax <= 64.9) categoryWeightCode = '-65kg'
        else categoryWeightCode = '+65kg'
      }
    }
    
    let ageGroup = 'Cadetes'
    const pageTitle = doc.querySelector('title')?.textContent?.toLowerCase() || ''
    if (pageTitle.includes('juvenil')) ageGroup = 'Juveniles'
    else if (pageTitle.includes('adulto')) ageGroup = 'Adultos'
    
    // Usar el selector correcto: p.competidor.lh-1
    const competitorElements = doc.querySelectorAll('p.competidor.lh-1')
    
    competitorElements.forEach(el => {
      let rawName = el.textContent?.trim() || ''
      rawName = rawName.replace(/Check peso:\s*(no|si)/i, '').trim()
      rawName = rawName.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()
      
      if (!rawName || rawName.length < 3) return
      
      const normalized = normalizeName(rawName)
      const displayName = formatName(rawName)
      
      if (seenNames.has(normalized)) return
      seenNames.add(normalized)
      
      // Buscar el div padre para obtener academia y peso
      const parentDiv = el.closest('.competidor-azul-doble, .competidor-rojo-doble')
      let academy = ''
      let weightKg = null
      
      if (parentDiv) {
        const clubElement = parentDiv.querySelector('.club')
        academy = clubElement?.textContent?.trim() || ''
        
        const edadPesoElement = parentDiv.querySelector('.edadpeso')
        if (edadPesoElement) {
          const text = edadPesoElement.textContent?.trim() || ''
          const weightMatch = text.match(/(\d+(?:\.\d+)?)\s*Kilos/i)
          if (weightMatch) {
            weightKg = parseFloat(weightMatch[1])
          }
        }
      }
      
      const normalizedAcademy = normalizeAcademy(academy)
      const displayAcademy = formatAcademy(academy)
      
      competitorsList.push({
        name: displayName,
        normalizedName: normalized,
        academy: displayAcademy || 'Sin academia',
        normalizedAcademy: normalizedAcademy,
        weightKg,
        gender: categoryGender,
        ageGroup,
        weightCategory: categoryWeightCode,
        isDan: true,
        confidence: 'high'
      })
    })
    
    console.log(`Categoría ${categoryInfo.name}: ${competitorsList.length} competidores únicos`)
    return competitorsList
  }

  const fetchTournament = async () => {
    if (!url.includes('tknet.cl')) {
      setError('La URL debe ser de tknet.cl')
      return
    }
    
    const USE_DEMO = false
    
    if (USE_DEMO) {
      setLoading(true)
      setError('')
      setStep('loading')
      await new Promise(r => setTimeout(r, 1500))
      const urlParts = url.split('/')
      const tournamentName = urlParts[urlParts.length - 1] || 'Torneo TKNET'
      setTournament({
        title: tournamentName.replace(/-/g, ' ').toUpperCase(),
        dates: [new Date().toISOString().split('T')[0]],
        slug: 'demo'
      })
      const demoCompetitors = [
        { name: 'Pedro González', academy: 'Team León', gender: 'Varones', ageGroup: 'Cadetes', weightKg: 45, isDan: true },
        { name: 'Martín Soto', academy: 'Team León', gender: 'Varones', ageGroup: 'Cadetes', weightKg: 45, isDan: true },
        { name: 'Camila Rojas', academy: 'Phoenix', gender: 'Damas', ageGroup: 'Cadetes', weightKg: 41, isDan: true },
        { name: 'Valentina Díaz', academy: 'Kim Gan', gender: 'Damas', ageGroup: 'Cadetes', weightKg: 41, isDan: true }
      ]
      setCompetitors(demoCompetitors)
      setStep('preview')
      setLoading(false)
      return
    }
    
    setLoading(true)
    setError('')
    setStep('loading')
    
    try {
      const html = await fetchWithProxy(url)
      const info = parseTournamentInfo(html, url)
      setTournament(info)
      
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')
      
      const categories = []
      const links = doc.querySelectorAll('a[href*="llave-"]')
      
      links.forEach(link => {
        const href = link.getAttribute('href')
        const text = link.textContent?.trim() || ''
        const match = href?.match(/llave-([^/?\s]+)/)
        if (match) {
          const slug = match[1]
          const isDan = /dan/i.test(slug) || /dan/i.test(text)
          categories.push({ slug, name: text || slug, isDan })
        }
      })
      
      const uniqueCategories = Array.from(new Map(categories.map(c => [c.slug, c])).values())
      
      const catsToLoad = filterDan ? uniqueCategories.filter(c => c.isDan) : uniqueCategories
      setProgress({ done: 0, total: catsToLoad.length })
      
      const allCompetitors = []
      
      for (let i = 0; i < catsToLoad.length; i++) {
        const cat = catsToLoad[i]
        setProgress({ done: i + 1, total: catsToLoad.length })
        
        try {
          if (!cat?.slug) continue
          
          const catUrl = `https://www.tknet.cl/${info.slug}/llave-${cat.slug}`
          const catHtml = await fetchWithProxy(catUrl)
          const catCompetitors = parseCategoryCompetitors(catHtml, cat)
          allCompetitors.push(...catCompetitors)
        } catch (e) {
          console.warn(`Error cargando categoría ${cat?.slug}:`, e.message)
        }
        
        await new Promise(r => setTimeout(r, 500))
      }
      
      // Eliminar duplicados globales
      const globalSeen = new Map()
      const uniqueCompetitors = allCompetitors.filter(c => {
        const key = `${c.normalizedName}|${c.normalizedAcademy}`.toLowerCase()
        if (globalSeen.has(key)) return false
        globalSeen.set(key, true)
        return true
      })
      
      setCompetitors(uniqueCompetitors)
      setStep('preview')
      
    } catch (error) {
      setError(`Error: ${error.message}`)
      setStep('idle')
    } finally {
      setLoading(false)
    }
  }

  // Procesar HTML manual
    const processManualHtml = () => {
    if (!manualHtml.trim()) {
        setError('Pega el HTML primero')
        return
    }
    
    setLoading(true)
    setError('')
    setStep('loading')
    
    setTimeout(async () => {
        try {
        const parser = new DOMParser()
        const doc = parser.parseFromString(manualHtml, 'text/html')
        
        // Buscar todas las categorías (artículos con clase llaves)
        const categoryArticles = doc.querySelectorAll('.llaves')
        console.log(`Categorías encontradas: ${categoryArticles.length}`)
        
        const allCompetitors = []
        let processed = 0
        setProgress({ done: 0, total: categoryArticles.length })
        
        for (const article of categoryArticles) {
            const titleElement = article.querySelector('.tit-competi')
            if (!titleElement) continue
            
            const titleText = titleElement.textContent || ''
            
            // Determinar género
            let gender = 'Varones'
            if (titleText.includes('Damas') || titleText.includes('Femenina')) {
            gender = 'Damas'
            }
            
            // Extraer rango de peso (ej: "9.0 a 32.9")
            const weightRangeMatch = titleText.match(/(\d+\.?\d*)\s*a\s*(\d+\.?\d*)/)
            let weightMin = null
            let weightMax = null
            if (weightRangeMatch) {
            weightMin = parseFloat(weightRangeMatch[1])
            weightMax = parseFloat(weightRangeMatch[2])
            }
            
            // Determinar categoría de edad
            let ageGroup = 'Cadetes'
            const pageTitle = doc.querySelector('title')?.textContent?.toLowerCase() || ''
            if (pageTitle.includes('juvenil')) ageGroup = 'Juveniles'
            else if (pageTitle.includes('adulto')) ageGroup = 'Adultos'
            
            // Calcular categoría de peso usando la función de mapeo
            const categoryWeightCode = getWeightCategory(gender, ageGroup, weightMin, weightMax)
            console.log(`Categoría: ${gender} ${ageGroup} - Rango ${weightMin}-${weightMax}kg → ${categoryWeightCode}`)
            
            // Buscar TODOS los competidores por su clase "competidor lh-1"
            const competitorElements = article.querySelectorAll('p.competidor.lh-1')
            console.log(`Categoría ${processed + 1}: ${competitorElements.length} competidores`)
            
            const categorySeen = new Set()
            
            competitorElements.forEach(competidorElement => {
            let rawName = competidorElement.textContent?.trim() || ''
            rawName = rawName.replace(/Check peso:\s*(no|si)/i, '').trim()
            rawName = rawName.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()
            
            if (!rawName || rawName.length < 3) return
            
            const normalized = normalizeName(rawName)
            const displayName = formatName(rawName)
            
            if (categorySeen.has(normalized)) return
            categorySeen.add(normalized)
            
            // Buscar el div padre para obtener academia y peso
            const parentDiv = competidorElement.closest('.competidor-azul-doble, .competidor-rojo-doble')
            let academy = ''
            let weightKg = null
            
            if (parentDiv) {
                const clubElement = parentDiv.querySelector('.club')
                academy = clubElement?.textContent?.trim() || ''
                
                const edadPesoElement = parentDiv.querySelector('.edadpeso')
                if (edadPesoElement) {
                const text = edadPesoElement.textContent?.trim() || ''
                const weightMatch = text.match(/(\d+(?:\.\d+)?)\s*Kilos/i)
                if (weightMatch) {
                    weightKg = parseFloat(weightMatch[1])
                }
                }
            }
            
            const normalizedAcademy = normalizeAcademy(academy)
            const displayAcademy = formatAcademy(academy)
            
            allCompetitors.push({
                name: displayName,
                normalizedName: normalized,
                academy: displayAcademy || 'Sin academia',
                normalizedAcademy: normalizedAcademy,
                weightKg,
                gender,
                ageGroup,
                weightCategory: categoryWeightCode,
                isDan: true,
                confidence: 'high'
            })
            })
            
            processed++
            setProgress({ done: processed, total: categoryArticles.length })
            await new Promise(r => setTimeout(r, 50))
        }
        
        // Eliminar duplicados globales por nombre + academia normalizada
        const globalSeen = new Map()
        const uniqueCompetitors = allCompetitors.filter(c => {
            const key = `${c.normalizedName}|${c.normalizedAcademy}`.toLowerCase()
            if (globalSeen.has(key)) return false
            globalSeen.set(key, true)
            return true
        })
        
        console.log(`Total competidores únicos: ${uniqueCompetitors.length} (de ${allCompetitors.length} encontrados)`)
        
        setCompetitors(uniqueCompetitors)
        setTournament({
            title: doc.querySelector('h1')?.textContent?.trim() || 'Torneo TKNET',
            dates: [new Date().toISOString().split('T')[0]]
        })
        setStep('preview')
        
        } catch (error) {
        console.error('Error procesando HTML:', error)
        setError(`Error procesando HTML: ${error.message}`)
        setStep('idle')
        } finally {
        setLoading(false)
        }
    }, 500)
    }

  // ==================== FUNCIONES TEK-SPORT ====================
  // Parsear JSON de TEK-SPORT con normalización
    const parseTekSportJSON = (jsonText, divisionCode) => {
    console.log('parseTekSportJSON llamado', { divisionCode })
    
    try {
        const competitorsList = []
        
        const ageMap = {
        'CADETS': 'Cadetes',
        'JUNIORS': 'Juveniles',
        'SENIORS': 'Adultos'
        }
        
        const defaultAge = ageMap[divisionCode] || 'Adultos'
        
        const processJSON = (data) => {
        if (data.combatMatWeights && Array.isArray(data.combatMatWeights)) {
            data.combatMatWeights.forEach(cat => {
            const categoryWeight = cat.categoryWeight || ''
            
            let gender = 'Varones'
            let weightKg = null
            let weightCategory = null
            
            if (categoryWeight.startsWith('W-')) {
                gender = 'Damas'
                const weightMatch = categoryWeight.match(/W-(\d+)KG/i)
                if (weightMatch) {
                weightKg = parseInt(weightMatch[1])
                weightCategory = `-${weightKg}kg`
                }
            } else if (categoryWeight.startsWith('M-')) {
                gender = 'Varones'
                const weightMatch = categoryWeight.match(/M-(\d+)KG/i)
                if (weightMatch) {
                weightKg = parseInt(weightMatch[1])
                weightCategory = `-${weightKg}kg`
                }
            }
            
            if (cat.combatMats && Array.isArray(cat.combatMats)) {
                cat.combatMats.forEach(athlete => {
                if (athlete.userName) {
                    // Limpiar nombre original
                    let rawName = athlete.userName.replace(/^#[0-9]+\s*/, '').trim()
                    rawName = rawName.replace(/\s+/g, ' ').trim()
                    
                    // Normalizar nombre
                    const normalized = normalizeName(rawName)
                    const displayName = formatName(rawName)
                    
                    // Limpiar y normalizar academia
                    let rawAcademy = (athlete.academyName || '').trim()
                    const normalizedAcademy = normalizeAcademy(rawAcademy)
                    const displayAcademy = formatAcademy(rawAcademy)
                    
                    competitorsList.push({
                    name: displayName,
                    normalizedName: normalized,
                    academy: displayAcademy || 'Sin academia',
                    normalizedAcademy: normalizedAcademy,
                    gender,
                    ageGroup: defaultAge,
                    weightKg,
                    weightCategory,
                    isDan: true,
                    confidence: 'high'
                    })
                }
                })
            }
            })
        }
        }

        // Procesar JSON (puede ser array único o múltiples)
        if (jsonText.trim().startsWith('[')) {
        try {
            const arrayData = JSON.parse(jsonText)
            if (Array.isArray(arrayData)) {
            arrayData.forEach(item => processJSON(item))
            }
        } catch (e) {
            console.log('No es un array JSON válido, probando otros métodos')
        }
        } else {
        const jsonObjects = []
        let startIndex = 0
        
        while (startIndex < jsonText.length) {
            const openBrace = jsonText.indexOf('{', startIndex)
            if (openBrace === -1) break
            
            let braceCount = 0
            let inString = false
            let endIndex = -1
            
            for (let i = openBrace; i < jsonText.length; i++) {
            const char = jsonText[i]
            
            if (char === '"' && jsonText[i-1] !== '\\') {
                inString = !inString
            }
            
            if (!inString) {
                if (char === '{') braceCount++
                else if (char === '}') braceCount--
            }
            
            if (braceCount === 0 && i > openBrace) {
                endIndex = i + 1
                break
            }
            }
            
            if (endIndex !== -1) {
            const jsonStr = jsonText.substring(openBrace, endIndex)
            try {
                const data = JSON.parse(jsonStr)
                jsonObjects.push(data)
                startIndex = endIndex
            } catch (e) {
                console.log('Error parseando objeto JSON:', e.message)
                startIndex = openBrace + 1
            }
            } else {
            break
            }
        }
        
        jsonObjects.forEach(data => processJSON(data))
        }
        
        // Eliminar duplicados por nombre normalizado + academia normalizada
        const seen = new Map()
        const uniqueCompetitors = competitorsList.filter(c => {
        const key = `${c.normalizedName}|${c.normalizedAcademy}`.toLowerCase()
        if (seen.has(key)) return false
        seen.set(key, true)
        return true
        })
        
        console.log(`TEK-SPORT: ${competitorsList.length} encontrados, ${uniqueCompetitors.length} únicos`)
        return uniqueCompetitors
        
    } catch (error) {
        console.error('Error parseando JSON:', error)
        return []
    }
    }

  const parseJSON = () => {
    if (!jsonText.trim()) {
        setError('Pega el JSON primero')
        return
    }
    
    setLoading(true)
    setError('')
    
    try {
        const comps = parseTekSportJSON(jsonText, divisionCode)
        if (comps.length === 0) {
        setError('No se encontraron competidores en el JSON')
        } else {
        setCompetitors(comps)
        // Intentar extraer nombre del torneo del JSON si es posible
        let tournamentName = 'Torneo TEK-SPORT'
        try {
            const firstData = JSON.parse(jsonText)
            if (firstData.combatMatWeights?.[0]?.categoryWeight) {
            // Extraer nombre del torneo de la categoría
            const catWeight = firstData.combatMatWeights[0].categoryWeight
            const match = catWeight.match(/([A-Za-z\s]+)/)
            if (match) {
                tournamentName = match[1].trim() || 'Torneo TEK-SPORT'
            }
            }
        } catch (e) {}
        
        setTournament({
            title: tournamentName,
            dates: [new Date().toISOString().split('T')[0]]
        })
        setStep('preview')
        }
    } catch (error) {
        setError(`Error: ${error.message}`)
    } finally {
        setLoading(false)
    }
    }

  // ==================== FUNCIÓN DE IMPORTACIÓN ====================
  const confirmImport = () => {
    const log = []
    const newTeams = []
    const newPlayers = []
    const newParticipations = []
    const teamMap = new Map()
    const playerMap = new Map()

    if (importOptions.createTeams) {
      const uniqueAcademies = [...new Set(competitors.map(c => c.academy).filter(Boolean))]
      
      uniqueAcademies.forEach(name => {
        const existingTeam = mockTeams.find(t => t.name.toLowerCase() === name.toLowerCase())
        
        if (existingTeam) {
          teamMap.set(name, existingTeam.id)
          log.push(`⏭ Academia ya existe: ${name}`)
        } else {
          const teamId = `team_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
          teamMap.set(name, teamId)
          newTeams.push({
            id: teamId,
            name,
            city: '',
            region: ''
          })
          log.push(`✅ Academia: ${name}`)
        }
      })
    }

    if (importOptions.createPlayers) {
      competitors.forEach(c => {
        const existingPlayer = mockPlayers.find(p => 
          normalizeName(p.name) === c.normalizedName &&
          p.gender === c.gender
        )
        
        if (existingPlayer) {
          playerMap.set(c.name, existingPlayer.id)
          log.push(`⏭ Deportista ya existe: ${c.name}`)
        } else {
          const playerId = `player_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
          const teamId = teamMap.get(c.academy) || null
          
          let weightCategory = c.weightCategory || null
          if (!weightCategory && c.weightKg) {
            weightCategory = `-${c.weightKg}kg`
          }
          
          playerMap.set(c.name, playerId)
          newPlayers.push({
            id: playerId,
            name: c.name,
            gender: c.gender,
            ageGroup: c.ageGroup,
            weightCategory: weightCategory,
            teamId,
            dan: '1° Dan',
            status: 'Activo',
            photo: null
          })
          log.push(`✅ Deportista: ${c.name} (${c.gender} ${c.ageGroup} ${weightCategory || 'sin peso'})`)
        }
      })
    }

    let newEvent = null
    let eventId = null
    
    if (importOptions.createEvent) {
      const existingEvent = mockEvents.find(e => 
        e.name.toLowerCase() === eventInfo.name.toLowerCase()
      )
      
      if (existingEvent) {
        eventId = existingEvent.id
        log.push(`⏭ Evento ya existe: ${eventInfo.name}`)
      } else {
        eventId = `event_${Date.now()}`
        newEvent = {
          id: eventId,
          name: eventInfo.name,
          type: eventInfo.type,
          date: eventInfo.date,
          endDate: eventInfo.endDate || eventInfo.date,
          location: eventInfo.location,
          status: 'Próximo',
          isLeagueEvent: false,
          description: `Importado desde ${source === 'tknet' ? 'TKNET' : 'TEK-SPORT'}`
        }
        log.push(`✅ Evento: ${eventInfo.name}`)
      }
    }

    if (eventId && (importOptions.createPlayers || importOptions.createTeams)) {
      competitors.forEach(c => {
        const playerId = playerMap.get(c.name)
        if (playerId) {
          const existingParticipation = mockParticipations?.some(p => 
            p.eventId === eventId && p.playerId === playerId
          )
          
          if (!existingParticipation) {
            newParticipations.push({
              eventId,
              playerId,
              weighIn: false,
              victories: 0,
              position: null,
              status: 'Inscrito'
            })
            log.push(`✅ Participación: ${c.name} en ${eventInfo.name}`)
          } else {
            log.push(`⏭ Participación ya existe: ${c.name}`)
          }
        }
      })
    }

    if (onImport) {
      onImport({
        event: newEvent,
        teams: newTeams,
        players: newPlayers,
        participations: newParticipations,
        log
      })
    }

    setImportLog(log)
    setStep('done')
  }

  // ==================== RENDER ====================
  return (
    <div style={{ 
      position: 'fixed',
      inset: 0,
      background: '#000c',
      zIndex: 1000,
      overflowY: 'auto',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '40px auto',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '24px'
      }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ color: 'var(--accent-tkd)', margin: 0 }}>📥 Importar datos</h2>
          {onClose && (
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '24px', cursor: 'pointer' }}>×</button>
          )}
        </div>

        {step === 'idle' && !source && (
          <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            <Card glow glowColor="#f39c12" style={{ cursor: 'pointer' }} onClick={() => setSource('tknet')}>
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '48px' }}>🌐</span>
              </div>
              <h3 style={{ textAlign: 'center', marginBottom: '8px', color: '#f39c12' }}>TKNET.CL</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', textAlign: 'center' }}>
                Importar automáticamente desde la web
              </p>
            </Card>

            <Card glow glowColor="#00e5ff" style={{ cursor: 'pointer' }} onClick={() => setSource('teksport')}>
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '48px' }}>📋</span>
              </div>
              <h3 style={{ textAlign: 'center', marginBottom: '8px', color: '#00e5ff' }}>TEK-SPORT</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', textAlign: 'center' }}>
                Importar pegando JSON
              </p>
            </Card>
          </div>
        )}

        {source && step === 'idle' && (
          <div>
            <Button variant="ghost" onClick={() => setSource(null)} style={{ marginBottom: '20px' }}>
              ← Volver
            </Button>
            
            {source === 'tknet' && (
              <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ color: '#f39c12', margin: 0 }}>Importar desde TKNET.CL</h3>
                  <Badge color="#f39c12" style={{ fontSize: '10px' }}>
                    {importMode === 'auto' ? 'Auto' : 'Manual'}
                  </Badge>
                </div>

                <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      checked={importMode === 'auto'}
                      onChange={() => setImportMode('auto')}
                    />
                    <span>Importación automática (requiere proxy)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      checked={importMode === 'manual'}
                      onChange={() => setImportMode('manual')}
                    />
                    <span>Pegar HTML manualmente</span>
                  </label>
                </div>

                {importMode === 'auto' && (
                  <>
                    <Input
                      label="URL del torneo"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://www.tknet.cl/nombre-del-torneo"
                      style={{ marginBottom: '16px' }}
                    />
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                      <input
                        type="checkbox"
                        id="filterDan"
                        checked={filterDan}
                        onChange={(e) => setFilterDan(e.target.checked)}
                      />
                      <label htmlFor="filterDan">Importar solo categorías Dan</label>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                      <Button variant="ghost" onClick={reset}>Cancelar</Button>
                      <Button variant="warning" onClick={fetchTournament} disabled={!url}>
                        Obtener datos
                      </Button>
                    </div>
                  </>
                )}

                {importMode === 'manual' && (
                  <>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                        HTML de la página del torneo
                      </label>
                      <textarea
                        value={manualHtml}
                        onChange={(e) => setManualHtml(e.target.value)}
                        rows={12}
                        placeholder='Pega aquí el HTML de la página del torneo...'
                        style={{
                          width: '100%',
                          padding: '8px',
                          background: 'var(--bg-card)',
                          border: '1px solid var(--border)',
                          borderRadius: '6px',
                          color: 'var(--text-primary)',
                          fontFamily: 'monospace',
                          resize: 'vertical'
                        }}
                      />
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                      <input
                        type="checkbox"
                        id="filterDanManual"
                        checked={filterDan}
                        onChange={(e) => setFilterDan(e.target.checked)}
                      />
                      <label htmlFor="filterDanManual">Importar solo categorías Dan</label>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                      <Button variant="ghost" onClick={reset}>Cancelar</Button>
                      <Button variant="warning" onClick={processManualHtml} disabled={!manualHtml}>
                        Procesar HTML
                      </Button>
                    </div>
                  </>
                )}
              </Card>
            )}

            {source === 'teksport' && (
              <Card>
                <h3 style={{ color: '#00e5ff', marginBottom: '16px' }}>Importar desde TEK-SPORT</h3>
                
                <Select
                  label="Categoría de edad *"
                  value={divisionCode}
                  onChange={(e) => setDivisionCode(e.target.value)}
                  options={[
                    { value: 'CADETS', label: 'Cadetes' },
                    { value: 'JUNIORS', label: 'Juveniles' },
                    { value: 'SENIORS', label: 'Adultos' }
                  ]}
                />
                
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                    JSON de la respuesta
                  </label>
                  <textarea
                    value={jsonText}
                    onChange={(e) => setJsonText(e.target.value)}
                    rows={10}
                    placeholder='Pega aquí el JSON...'
                    style={{
                      width: '100%',
                      padding: '8px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderRadius: '6px',
                      color: 'var(--text-primary)',
                      fontFamily: 'monospace',
                      resize: 'vertical'
                    }}
                  />
                </div>
                
                {jsonText && (
                  <div style={{ marginBottom: '16px' }}>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        try {
                          JSON.parse(jsonText)
                          alert('✅ JSON válido')
                        } catch (e) {
                          alert(`❌ JSON inválido: ${e.message}`)
                        }
                      }}
                    >
                      🔍 Verificar JSON
                    </Button>
                  </div>
                )}
                
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <Button variant="ghost" onClick={reset}>Cancelar</Button>
                  <Button variant="primary" onClick={parseJSON} disabled={!jsonText}>
                    Analizar JSON
                  </Button>
                </div>
              </Card>
            )}
          </div>
        )}

        {step === 'loading' && (
          <Card style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px', animation: 'spin 1s linear infinite' }}>⚙️</div>
            <h3>Cargando datos...</h3>
            {progress.total > 0 && (
              <>
                <div style={{ maxWidth: '300px', margin: '20px auto' }}>
                  <div style={{ 
                    height: '8px', 
                    background: 'var(--border)', 
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${(progress.done / progress.total) * 100}%`,
                      height: '100%',
                      background: 'var(--accent-tkd)',
                      transition: 'width 0.3s'
                    }} />
                  </div>
                  <div style={{ marginTop: '8px', color: 'var(--text-secondary)' }}>
                    {progress.done} de {progress.total} categorías
                  </div>
                </div>
              </>
            )}
          </Card>
        )}

        {step === 'preview' && (
          <div>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr auto 1fr',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <div>
                <Button variant="ghost" onClick={() => setStep('idle')}>
                  ← Volver
                </Button>
              </div>

              <h2 style={{ color: 'var(--accent-tkd)', margin: 0, textAlign: 'center' }}>
                📋 Vista previa de importación
              </h2>

              {source === 'teksport' && (
                <div style={{ textAlign: 'right' }}>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      try {
                        JSON.parse(jsonText)
                        alert('✅ JSON válido')
                      } catch (e) {
                        alert(`❌ JSON inválido: ${e.message}`)
                      }
                    }}
                  >
                    🔍 Verificar JSON
                  </Button>
                </div>
              )}
            </div>

            <div style={{ 
              background: 'var(--accent-green)22',
              border: '1px solid var(--accent-green)',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontWeight: 'bold', color: 'var(--accent-green)' }}>
                🏅 Vista previa - {competitors.length} competidores encontrados
              </span>
              <Badge color="var(--accent-green)">
                {competitors.filter(c => {
                  const exists = mockPlayers?.some(p => 
                    normalizeName(p.name) === c.normalizedName &&
                    p.gender === c.gender
                  )
                  return !exists
                }).length} nuevos · {
                  competitors.filter(c => {
                    const exists = mockPlayers?.some(p => 
                      normalizeName(p.name) === c.normalizedName &&
                      p.gender === c.gender
                    )
                    return exists
                  }).length
                } existentes
              </Badge>
            </div>

            <Card style={{ marginBottom: '20px' }}>
              <h3 style={{ color: 'var(--accent-tkd)', marginBottom: '16px' }}>📅 Información del evento</h3>
              
              <div style={{ display: 'grid', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                  <Input
                    label="Nombre del evento *"
                    value={eventInfo.name}
                    onChange={(e) => setEventInfo({ ...eventInfo, name: e.target.value })}
                    placeholder="Ej: Torneo Nacional 2026"
                  />
                  <Select
                    label="Tipo"
                    value={eventInfo.type}
                    onChange={(e) => setEventInfo({ ...eventInfo, type: e.target.value })}
                    options={[
                      { value: 'Torneo', label: 'Torneo' },
                      { value: 'Encuentro', label: 'Encuentro' },
                      { value: 'Entrenamiento', label: 'Entrenamiento' },
                      { value: 'Otro', label: 'Otro' }
                    ]}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <Input
                    label="Fecha inicio"
                    type="date"
                    value={eventInfo.date}
                    onChange={(e) => setEventInfo({ ...eventInfo, date: e.target.value })}
                  />
                  <Input
                    label="Fecha término"
                    type="date"
                    value={eventInfo.endDate}
                    onChange={(e) => setEventInfo({ ...eventInfo, endDate: e.target.value })}
                  />
                </div>

                <Input
                  label="Ubicación / Sede"
                  value={eventInfo.location}
                  onChange={(e) => setEventInfo({ ...eventInfo, location: e.target.value })}
                  placeholder="Ej: Gimnasio Polideportivo"
                />
              </div>
            </Card>

            <Card style={{ marginBottom: '20px' }}>
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px'
              }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={importOptions.createEvent}
                    onChange={(e) => setImportOptions({ ...importOptions, createEvent: e.target.checked })}
                  />
                  Crear evento
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={importOptions.createTeams}
                    onChange={(e) => setImportOptions({ ...importOptions, createTeams: e.target.checked })}
                  />
                  Crear academias
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={importOptions.createPlayers}
                    onChange={(e) => setImportOptions({ ...importOptions, createPlayers: e.target.checked })}
                  />
                  Crear deportistas
                </label>
              </div>
            </Card>

            <Card>
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ position: 'sticky', top: 0, background: 'var(--bg-secondary)' }}>
                    <tr>
                      <th style={{ padding: '12px 8px', textAlign: 'left' }}>Nombre</th>
                      <th style={{ padding: '12px 8px', textAlign: 'left' }}>Academia</th>
                      <th style={{ padding: '12px 8px', textAlign: 'center' }}>Género</th>
                      <th style={{ padding: '12px 8px', textAlign: 'center' }}>Edad</th>
                      <th style={{ padding: '12px 8px', textAlign: 'center' }}>Peso</th>
                      <th style={{ padding: '12px 8px', textAlign: 'center' }}>Estado</th>
                     </tr>
                  </thead>
                  <tbody>
                    {competitors.map((c, i) => {
                      const exists = mockPlayers?.some(p => 
                        normalizeName(p.name) === c.normalizedName &&
                        p.gender === c.gender
                      )
                      
                      return (
                        <tr key={i} style={{ 
                          borderBottom: '1px solid var(--border)',
                          background: exists ? 'var(--accent-gold)11' : 'transparent'
                        }}>
                          <td style={{ padding: '8px' }}>{c.name}</td>
                          <td style={{ padding: '8px' }}>{c.academy || '—'}</td>
                          <td style={{ padding: '8px', textAlign: 'center' }}>{c.gender}</td>
                          <td style={{ padding: '8px', textAlign: 'center' }}>{c.ageGroup}</td>
                          <td style={{ padding: '8px', textAlign: 'center' }}>
                            {c.weightCategory || (c.weightKg ? `-${c.weightKg}kg` : '—')}
                          </td>
                          <td style={{ padding: '8px', textAlign: 'center' }}>
                            {exists ? (
                              <Badge color="var(--accent-gold)">Ya existe</Badge>
                            ) : (
                              <Badge color="var(--accent-green)">Nuevo</Badge>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              
              <div style={{ 
                marginTop: '16px',
                padding: '12px',
                background: 'var(--bg-card)',
                borderRadius: '8px',
                display: 'flex',
                gap: '16px',
                justifyContent: 'space-around'
              }}>
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>Totales: </span>
                  <strong>{competitors.length}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>Nuevos: </span>
                  <strong style={{ color: 'var(--accent-green)' }}>
                    {competitors.filter(c => !mockPlayers?.some(p => 
                      normalizeName(p.name) === c.normalizedName &&
                      p.gender === c.gender
                    )).length}
                  </strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>Existentes: </span>
                  <strong style={{ color: 'var(--accent-gold)' }}>
                    {competitors.filter(c => mockPlayers?.some(p => 
                      normalizeName(p.name) === c.normalizedName &&
                      p.gender === c.gender
                    )).length}
                  </strong>
                </div>
              </div>
            </Card>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <Button variant="ghost" onClick={() => setStep('idle')}>
                Cancelar
              </Button>
              <Button variant="success" onClick={confirmImport}>
                Confirmar importación ({competitors.length} deportistas)
              </Button>
            </div>
          </div>
        )}

        {step === 'done' && (
          <Card glow glowColor="var(--accent-green)">
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <span style={{ fontSize: '48px' }}>✅</span>
              <h2 style={{ color: 'var(--accent-green)', marginTop: '10px' }}>Importación completada</h2>
            </div>
            
            <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px' }}>
              {importLog.map((log, i) => (
                <div key={i} style={{ 
                  padding: '4px 8px',
                  color: log.startsWith('✅') ? 'var(--accent-green)' : log.startsWith('⏭') ? 'var(--accent-gold)' : 'var(--text-secondary)',
                  fontSize: '13px'
                }}>
                  {log}
                </div>
              ))}
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Button variant="primary" onClick={reset}>
                Importar otro
              </Button>
              {onClose && (
                <Button variant="ghost" onClick={onClose}>
                  Cerrar
                </Button>
              )}
            </div>
          </Card>
        )}

        {error && (
          <Card style={{ background: 'var(--accent-red)11', borderColor: 'var(--accent-red)', marginTop: '20px' }}>
            <p style={{ color: 'var(--accent-red)' }}>{error}</p>
          </Card>
        )}

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  )
}